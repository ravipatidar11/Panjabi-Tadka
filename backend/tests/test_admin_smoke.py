import unittest


class AdminFlowSmokeTest(unittest.TestCase):
    def test_order_status_flow_exists(self):
        try:
            from app.main import ORDER_STATUS_FLOW, PAYMENT_STATUS_OPTIONS
        except Exception as exc:  # pragma: no cover
            raise AssertionError(f"Admin status configuration is missing: {exc}")

        self.assertIn("pending", ORDER_STATUS_FLOW)
        self.assertIn("paid", PAYMENT_STATUS_OPTIONS)


if __name__ == "__main__":
    unittest.main()
