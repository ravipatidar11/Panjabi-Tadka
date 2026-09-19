import unittest

from app.main import ORDER_STATUS_FLOW, PAYMENT_STATUS_OPTIONS


class AdminFlowSmokeTest(unittest.TestCase):
    def test_order_status_flow_exists(self):
        self.assertIn("pending", ORDER_STATUS_FLOW)
        self.assertIn("paid", PAYMENT_STATUS_OPTIONS)


if __name__ == "__main__":
    unittest.main()
