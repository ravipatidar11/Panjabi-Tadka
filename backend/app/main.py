import base64
import hashlib
import hmac
import json
import os
import time
from contextlib import asynccontextmanager
from datetime import date, datetime
from decimal import Decimal
from typing import Any, Optional

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlalchemy import Date, DateTime, ForeignKey, Numeric, String, Text, create_engine, select
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column, relationship, sessionmaker

ORDER_STATUS_FLOW = ["pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"]
PAYMENT_STATUS_OPTIONS = ["pending", "paid", "failed", "refunded"]


class Settings(BaseSettings):
    database_url: str = "sqlite:///./local.db"
    frontend_url: str = "http://localhost:3000"
    allowed_origins: str = "http://localhost:3000"
    admin_username: str = "admin"
    admin_password: str = "admin123"
    admin_session_secret: str = "punjabi-tadka-admin-secret-change-me"
    admin_session_ttl_hours: int = 8
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def origins(self) -> list[str]:
        return [origin.strip() for origin in self.allowed_origins.split(",") if origin.strip()]


settings = Settings()
database_url = settings.database_url
if database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql+psycopg://", 1)
elif database_url.startswith("postgresql://"):
    database_url = database_url.replace("postgresql://", "postgresql+psycopg://", 1)
connect_args = {"check_same_thread": False} if database_url.startswith("sqlite") else {}
engine = create_engine(database_url, pool_pre_ping=True, connect_args=connect_args)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


class Base(DeclarativeBase):
    pass


class MenuItemModel(Base):
    __tablename__ = "menu_items"
    id: Mapped[str] = mapped_column(String(80), primary_key=True)
    name: Mapped[str] = mapped_column(String(160))
    punjabi_name: Mapped[Optional[str]] = mapped_column(String(160), nullable=True)
    description: Mapped[str] = mapped_column(Text)
    price: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    category: Mapped[str] = mapped_column(String(40))
    category_label: Mapped[str] = mapped_column(String(80))
    image: Mapped[str] = mapped_column(Text)
    spice_level: Mapped[int] = mapped_column()
    is_veg: Mapped[bool] = mapped_column(default=False)
    is_gluten_free: Mapped[bool] = mapped_column(default=False)
    is_chef_special: Mapped[bool] = mapped_column(default=False)
    is_bestseller: Mapped[bool] = mapped_column(default=False)
    portion_size: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)


class OrderModel(Base):
    __tablename__ = "orders"
    id: Mapped[int] = mapped_column(primary_key=True)
    customer_name: Mapped[str] = mapped_column(String(120))
    phone: Mapped[str] = mapped_column(String(40))
    address: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    order_type: Mapped[str] = mapped_column(String(20))
    tip_percent: Mapped[Decimal] = mapped_column(Numeric(5, 2))
    subtotal: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    tax: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    delivery_fee: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    tip_amount: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    total: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    status: Mapped[str] = mapped_column(String(35), default="pending", index=True)
    payment_status: Mapped[str] = mapped_column(String(20), default="pending", index=True)
    admin_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    items: Mapped[list["OrderItemModel"]] = relationship(cascade="all, delete-orphan")


class OrderItemModel(Base):
    __tablename__ = "order_items"
    id: Mapped[int] = mapped_column(primary_key=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id"))
    menu_item_id: Mapped[str] = mapped_column(ForeignKey("menu_items.id"))
    menu_item: Mapped["MenuItemModel"] = relationship(foreign_keys=[menu_item_id])
    quantity: Mapped[int] = mapped_column()
    spice_level: Mapped[int] = mapped_column()
    special_instructions: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    unit_price: Mapped[Decimal] = mapped_column(Numeric(12, 2))


class ReservationModel(Base):
    __tablename__ = "reservations"
    id: Mapped[int] = mapped_column(primary_key=True)
    date: Mapped[date] = mapped_column(Date)
    time: Mapped[str] = mapped_column(String(30))
    guests: Mapped[int] = mapped_column()
    name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(254))
    phone: Mapped[str] = mapped_column(String(40))
    seating_preference: Mapped[str] = mapped_column(String(40))
    special_occasion: Mapped[Optional[str]] = mapped_column(String(80), nullable=True)
    special_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class CateringBookingModel(Base):
    __tablename__ = "catering_bookings"
    id: Mapped[int] = mapped_column(primary_key=True)
    event_type: Mapped[str] = mapped_column(String(100))
    event_date: Mapped[date] = mapped_column(Date)
    guest_count: Mapped[int] = mapped_column()
    package_type: Mapped[str] = mapped_column(String(120))
    name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(254))
    phone: Mapped[str] = mapped_column(String(40))
    budget_range: Mapped[str] = mapped_column(String(120))
    additional_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class ContactMessageModel(Base):
    __tablename__ = "contact_messages"
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(254))
    message: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class MenuItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
    id: str
    name: str
    punjabiName: str | None = None
    description: str
    price: Decimal
    category: str
    categoryLabel: str
    image: str
    spiceLevel: int
    isVeg: bool
    isGlutenFree: bool
    isChefSpecial: bool
    isBestseller: bool
    portionSize: str | None = None

    @classmethod
    def from_model(cls, item: MenuItemModel) -> "MenuItemOut":
        return cls.model_validate({
            "id": item.id, "name": item.name, "punjabiName": item.punjabi_name,
            "description": item.description, "price": item.price, "category": item.category,
            "categoryLabel": item.category_label, "image": item.image, "spiceLevel": item.spice_level,
            "isVeg": item.is_veg, "isGlutenFree": item.is_gluten_free,
            "isChefSpecial": item.is_chef_special, "isBestseller": item.is_bestseller,
            "portionSize": item.portion_size,
        })


class OrderLineIn(BaseModel):
    item_id: str
    quantity: int = Field(ge=1, le=50)
    spice_level: int = Field(ge=0, le=3)
    special_instructions: str | None = Field(default=None, max_length=500)


class OrderIn(BaseModel):
    customer_name: str = Field(min_length=2, max_length=120)
    phone: str = Field(min_length=7, max_length=40)
    address: str | None = Field(default=None, max_length=500)
    order_type: str = Field(pattern="^(pickup|delivery)$")
    tip_percent: Decimal = Field(ge=0, le=100)
    items: list[OrderLineIn] = Field(min_length=1, max_length=50)


class OrderOut(BaseModel):
    order_id: int
    order_code: str
    subtotal: Decimal
    tax: Decimal
    delivery_fee: Decimal
    tip_amount: Decimal
    total: Decimal
    status: str = "pending"
    payment_status: str = "pending"
    customer_name: str | None = None
    phone: str | None = None


class OrderItemOut(BaseModel):
    item_id: str
    name: str
    quantity: int
    spice_level: int
    unit_price: Decimal
    special_instructions: str | None = None


class AdminOrderOut(BaseModel):
    order_id: int
    order_code: str
    customer_name: str
    phone: str
    order_type: str
    address: str | None = None
    status: str
    payment_status: str
    subtotal: Decimal
    tax: Decimal
    delivery_fee: Decimal
    tip_amount: Decimal
    total: Decimal
    created_at: datetime
    updated_at: datetime
    items: list[OrderItemOut]


class ReservationIn(BaseModel):
    date: date
    time: str = Field(min_length=1, max_length=30)
    guests: int = Field(ge=1, le=100)
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    phone: str = Field(min_length=7, max_length=40)
    seating_preference: str = Field(max_length=40)
    special_occasion: str | None = Field(default=None, max_length=80)
    special_notes: str | None = Field(default=None, max_length=1000)


class CateringIn(BaseModel):
    event_type: str = Field(min_length=2, max_length=100)
    event_date: date
    guest_count: int = Field(ge=1, le=5000)
    package_type: str = Field(min_length=2, max_length=120)
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    phone: str = Field(min_length=7, max_length=40)
    budget_range: str = Field(max_length=120)
    additional_notes: str | None = Field(default=None, max_length=2000)


class ContactIn(BaseModel):
    email: EmailStr
    message: str = Field(min_length=2, max_length=2000)


class AdminLoginRequest(BaseModel):
    username: str
    password: str


class AdminStatusUpdate(BaseModel):
    status: str = Field(..., pattern=r"^(pending|confirmed|preparing|out_for_delivery|delivered|cancelled)$")
    payment_status: str | None = Field(default=None, pattern=r"^(pending|paid|failed|refunded)$")
    admin_notes: str | None = Field(default=None, max_length=2000)


security = HTTPBearer(auto_error=False)


def _b64url(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("ascii")


def _create_admin_token(username: str) -> str:
    payload = {
        "sub": username,
        "exp": int(time.time()) + (settings.admin_session_ttl_hours * 60 * 60),
        "iat": int(time.time()),
    }
    header = {"alg": "HS256", "typ": "admin"}
    header_segment = _b64url(json.dumps(header, separators=(",", ":")).encode("utf-8"))
    payload_segment = _b64url(json.dumps(payload, separators=(",", ":")).encode("utf-8"))
    signing_input = f"{header_segment}.{payload_segment}".encode("utf-8")
    signature = hmac.new(settings.admin_session_secret.encode("utf-8"), signing_input, hashlib.sha256).digest()
    return f"{header_segment}.{payload_segment}.{_b64url(signature)}"


def _verify_admin_token(token: str) -> str:
    try:
        header_segment, payload_segment, signature_segment = token.split(".")
    except ValueError as exc:
        raise HTTPException(status_code=401, detail="Invalid admin token") from exc
    signing_input = f"{header_segment}.{payload_segment}".encode("utf-8")
    expected_signature = _b64url(hmac.new(settings.admin_session_secret.encode("utf-8"), signing_input, hashlib.sha256).digest())
    if not hmac.compare_digest(signature_segment, expected_signature):
        raise HTTPException(status_code=401, detail="Invalid admin token")
    payload = json.loads(base64.urlsafe_b64decode(payload_segment + "=" * (-len(payload_segment) % 4)))
    if payload.get("exp", 0) < int(time.time()):
        raise HTTPException(status_code=401, detail="Admin token expired")
    return payload.get("sub") or "admin"


def _password_hash(value: str) -> str:
    salt = hashlib.sha256(settings.admin_session_secret.encode("utf-8")).digest()
    return hashlib.pbkdf2_hmac("sha256", value.encode("utf-8"), salt, 200_000).hex()


def _verify_admin_credentials(username: str, password: str) -> bool:
    return username == settings.admin_username and hmac.compare_digest(_password_hash(password), _password_hash(settings.admin_password))


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)) -> str:
    if not credentials:
        raise HTTPException(status_code=401, detail="Missing admin token")
    username = _verify_admin_token(credentials.credentials)
    if username != settings.admin_username:
        raise HTTPException(status_code=403, detail="Forbidden")
    return username


def serialize_order(order: OrderModel) -> AdminOrderOut:
    return AdminOrderOut(
        order_id=order.id,
        order_code=f"PT-ORD-{order.id:06d}",
        customer_name=order.customer_name,
        phone=order.phone,
        order_type=order.order_type,
        address=order.address,
        status=order.status,
        payment_status=order.payment_status,
        subtotal=order.subtotal,
        tax=order.tax,
        delivery_fee=order.delivery_fee,
        tip_amount=order.tip_amount,
        total=order.total,
        created_at=order.created_at,
        updated_at=order.updated_at,
        items=[
            OrderItemOut(
                item_id=item.menu_item_id,
                name=item.menu_item.name,
                quantity=item.quantity,
                spice_level=item.spice_level,
                unit_price=item.unit_price,
                special_instructions=item.special_instructions,
            )
            for item in order.items
        ],
    )


def seed_menu(db: Session) -> None:
    if db.scalar(select(MenuItemModel.id).limit(1)):
        return
    seed_data = [
        ("tandoori-chicken", "Royal Tandoori Chicken", "ਤੰਦੂਰੀ ਚਿਕਨ", 1590, "tandoori", "Tandoori Specialties", "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=800", 2, False, False, True, True, "Full / 4 Pieces"),
        ("paneer-tikka", "Amritsari Paneer Tikka", "ਪਨੀਰ ਟਿੱਕਾ", 1390, "tandoori", "Tandoori Specialties", "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&q=80&w=800", 1, True, True, False, True, "6 Pieces"),
        ("seekh-kebab", "Bhatti Seekh Kebab", "ਸੀਖ ਕਬਾਬ", 1680, "tandoori", "Tandoori Specialties", "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=800", 2, False, False, True, False, "4 Long Skewers"),
        ("butter-chicken", "Murgh Makhani (Butter Chicken)", "ਮੱਖਣੀ ਚਿਕਨ", 1640, "mains", "Main Course", "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&q=80&w=800", 1, False, True, False, True, "16 oz Bowl"),
        ("chicken-tikka-masala", "Chicken Tikka Masala", "ਚਿਕਨ ਟਿੱਕਾ ਮਸਾਲਾ", 1590, "mains", "Main Course", "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=800", 2, False, False, False, False, "16 oz Bowl"),
        ("mutton-roganjosh", "Dhaba Goat Curry", "ਗੋਸ਼ਤ ਕਰੀ", 1890, "mains", "Main Course", "https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&q=80&w=800", 3, False, False, True, False, "16 oz Bowl"),
        ("dal-makhani", "Overnight Slow-Cooked Dal Makhani", "ਦਾਲ ਮੱਖਣੀ", 1340, "mains", "Main Course", "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800", 1, True, True, False, True, "16 oz Bowl"),
        ("sarson-ka-saag", "Amritsari Sarson Ka Saag", "ਸਰੋਂ ਦਾ ਸਾਗ", 1420, "mains", "Main Course", "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=800", 2, True, False, True, False, "Served with Butter"),
        ("shahi-paneer", "Shahi Paneer Saffron", "ਸ਼ਾਹੀ ਪਨੀਰ", 1420, "mains", "Main Course", "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=800", 1, True, True, False, False, "16 oz Bowl"),
        ("amritsari-fish-fry", "Amritsari Fish Fry", "ਅੰਮ੍ਰਿਤਸਰੀ ਫਿਸ਼", 1340, "starters", "Starters", "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=800", 2, False, False, False, True, "6 Crispy Strips"),
        ("samosa-chaat", "Delhi Samosa Chaat", "ਸਮੋਸਾ ਚਾਟ", 920, "starters", "Starters", "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800", 1, True, False, False, False, "2 Big Samosas"),
        ("garlic-naan", "Garlic Butter Naan", "ਗਾਰਲਿਕ ਨਾਨ", 380, "breads", "Fresh Breads", "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800", 0, True, False, False, True, "1 Large Naan"),
        ("amritsari-kulcha", "Amritsari Stuffed Kulcha", "ਅੰਮ੍ਰਿਤਸਰੀ ਕੁਲਚਾ", 580, "breads", "Fresh Breads", "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=800", 1, True, False, True, False, "Served with Chana"),
        ("makki-di-roti", "Makki Di Roti", "ਮੱਕੀ ਦੀ ਰੋਟੀ", 360, "breads", "Fresh Breads", "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=800", 0, True, True, False, False, "1 Bread"),
        ("royal-mutton-biryani", "Royal Dum Mutton Biryani", "ਮਟਨ ਬਿਰਯਾਨੀ", 1840, "rice", "Biryanis & Rice", "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=800", 2, False, False, True, False, "Served with Raita"),
        ("saffron-jeera-rice", "Saffron Jeera Basmati Rice", "ਜੀਰਾ ਰਾਈਸ", 550, "rice", "Biryanis & Rice", "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=800", 0, True, True, False, False, "Serves 2"),
        ("mango-lassi", "Kulhad Mango Lassi", "ਮੈਂਗੋ ਲੱਸੀ", 500, "beverages", "Beverages & Drinks", "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&q=80&w=800", 0, True, False, False, True, "16 oz Kulhad"),
        ("gulab-jamun", "Hot Gulab Jamun with Rabri", "ਗੁਲਾਬ ਜਾਮੁਨ", 630, "desserts", "Desserts", "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800", 0, True, False, False, True, "2 Warm Pieces"),
        ("masala-chai", "Kullhad Special Masala Chai", "ਮਸਾਲਾ ਚਾਹ", 330, "beverages", "Beverages & Drinks", "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=800", 0, True, False, False, False, "Served Hot"),
    ]
    for row in seed_data:
        db.add(MenuItemModel(id=row[0], name=row[1], punjabi_name=row[2], price=row[3], category=row[4], category_label=row[5], image=row[6], spice_level=row[7], is_veg=row[8], is_gluten_free=row[9], is_chef_special=row[10], is_bestseller=row[11], portion_size=row[12], description="Authentic Punjabi preparation made fresh with traditional spices."))
    db.commit()


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        seed_menu(db)
    yield


app = FastAPI(title="Punjabi Tadka API", version="1.0.0", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=settings.origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "Punjabi Tadka API is running", "docs": "/docs"}


@app.post("/api/admin/login")
def admin_login(payload: AdminLoginRequest):
    if payload.username != settings.admin_username or not _verify_admin_credentials(payload.username, payload.password):
        raise HTTPException(status_code=401, detail="Invalid admin credentials")
    return {
        "token": _create_admin_token(payload.username),
        "username": payload.username,
        "role": "admin",
    }


@app.get("/api/admin/me")
def admin_me(username: str = Depends(get_current_admin)):
    return {"username": username, "role": "admin"}


@app.get("/api/admin/dashboard")
def admin_dashboard(username: str = Depends(get_current_admin), db: Session = Depends(get_db)):
    orders = db.scalars(select(OrderModel).order_by(OrderModel.created_at.desc())).all()
    total_revenue = sum((order.total for order in orders), Decimal("0"))
    metrics = {
        "total_orders": len(orders),
        "revenue": float(total_revenue),
        "pending": sum(1 for order in orders if order.status == "pending"),
        "delivered": sum(1 for order in orders if order.status == "delivered"),
        "cancelled": sum(1 for order in orders if order.status == "cancelled"),
    }
    return {
        "metrics": metrics,
        "orders": [serialize_order(order).model_dump(mode="json") for order in orders],
    }


@app.get("/api/admin/orders", response_model=list[AdminOrderOut])
def list_admin_orders(
    username: str = Depends(get_current_admin),
    db: Session = Depends(get_db),
    status: str | None = None,
    search: str | None = None,
):
    query = select(OrderModel)
    if status:
        query = query.where(OrderModel.status == status)
    if search:
        term = f"%{search.lower()}%"
        query = query.where((OrderModel.customer_name.ilike(term)) | (OrderModel.phone.ilike(term)) | (OrderModel.id.cast(String).ilike(term)))
    orders = db.scalars(query.order_by(OrderModel.created_at.desc())).all()
    return [serialize_order(order) for order in orders]


@app.patch("/api/admin/orders/{order_id}/status", response_model=AdminOrderOut)
def update_order_status(
    order_id: int,
    payload: AdminStatusUpdate,
    username: str = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    order = db.get(OrderModel, order_id)
    if not order:
        raise HTTPException(404, "Order not found")
    if payload.status not in ORDER_STATUS_FLOW:
        raise HTTPException(400, "Invalid order status")
    if payload.payment_status is not None and payload.payment_status not in PAYMENT_STATUS_OPTIONS:
        raise HTTPException(400, "Invalid payment status")
    order.status = payload.status
    if payload.payment_status:
        order.payment_status = payload.payment_status
    if payload.admin_notes is not None:
        order.admin_notes = payload.admin_notes
    order.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(order)
    return serialize_order(order)


@app.get("/api/orders/track")
def track_order(order_code: str, phone: str, db: Session = Depends(get_db)):
    order_id = int(order_code.replace("PT-ORD-", "")) if order_code.startswith("PT-ORD-") else None
    order = None
    if order_id is not None:
        order = db.get(OrderModel, order_id)
    if not order:
        raise HTTPException(404, "Order not found")
    if order.phone != phone:
        raise HTTPException(403, "Order phone number does not match")
    return {
        "order_id": order.id,
        "order_code": f"PT-ORD-{order.id:06d}",
        "customer_name": order.customer_name,
        "status": order.status,
        "payment_status": order.payment_status,
        "total": float(order.total),
        "updated_at": order.updated_at.isoformat(),
    }


@app.get("/api/menu", response_model=list[MenuItemOut])
def get_menu(db: Session = Depends(get_db)):
    return [MenuItemOut.from_model(item) for item in db.scalars(select(MenuItemModel).order_by(MenuItemModel.category, MenuItemModel.name)).all()]


@app.post("/api/orders", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
def create_order(payload: OrderIn, db: Session = Depends(get_db)):
    if payload.order_type == "delivery" and not payload.address:
        raise HTTPException(422, "Delivery address is required")
    ids = [line.item_id for line in payload.items]
    items = {item.id: item for item in db.scalars(select(MenuItemModel).where(MenuItemModel.id.in_(ids))).all()}
    if len(items) != len(set(ids)):
        raise HTTPException(404, "One or more menu items were not found")
    subtotal = sum((items[line.item_id].price * line.quantity for line in payload.items), Decimal("0"))
    tax = (subtotal * Decimal("0.05")).quantize(Decimal("0.01"))
    delivery_fee = Decimal("335.00") if payload.order_type == "delivery" else Decimal("0.00")
    tip_amount = (subtotal * payload.tip_percent / Decimal("100")).quantize(Decimal("0.01"))
    total = subtotal + tax + delivery_fee + tip_amount
    order = OrderModel(
        customer_name=payload.customer_name,
        phone=payload.phone,
        address=payload.address,
        order_type=payload.order_type,
        tip_percent=payload.tip_percent,
        subtotal=subtotal,
        tax=tax,
        delivery_fee=delivery_fee,
        tip_amount=tip_amount,
        total=total,
        status="pending",
        payment_status="pending",
    )
    db.add(order)
    db.flush()
    for line in payload.items:
        item = items[line.item_id]
        order.items.append(OrderItemModel(menu_item_id=item.id, quantity=line.quantity, spice_level=line.spice_level, special_instructions=line.special_instructions, unit_price=item.price))
    db.commit()
    db.refresh(order)
    order_code = f"PT-ORD-{order.id:06d}"
    return OrderOut(
        order_id=order.id,
        order_code=order_code,
        subtotal=subtotal,
        tax=tax,
        delivery_fee=delivery_fee,
        tip_amount=tip_amount,
        total=total,
        status=order.status,
        payment_status=order.payment_status,
        customer_name=order.customer_name,
        phone=order.phone,
    )


@app.post("/api/reservations", status_code=status.HTTP_201_CREATED)
def create_reservation(payload: ReservationIn, db: Session = Depends(get_db)):
    reservation = ReservationModel(**payload.model_dump())
    db.add(reservation)
    db.commit()
    db.refresh(reservation)
    return {"id": f"PT-{reservation.id:06d}", "message": "Reservation confirmed"}


@app.post("/api/catering", status_code=status.HTTP_201_CREATED)
def create_catering_booking(payload: CateringIn, db: Session = Depends(get_db)):
    booking = CateringBookingModel(**payload.model_dump())
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return {"id": booking.id, "message": "Catering request received"}


@app.post("/api/contact", status_code=status.HTTP_201_CREATED)
def create_contact_message(payload: ContactIn, db: Session = Depends(get_db)):
    message = ContactMessageModel(**payload.model_dump())
    db.add(message)
    db.commit()
    return {"message": "Thank you. We will be in touch."}
