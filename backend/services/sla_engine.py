import datetime
from typing import Tuple
from backend.models import PriorityLevel

class SLAEngine:
    DEFAULT_SLA_HOURS = {
        PriorityLevel.HIGH: 24,
        PriorityLevel.MEDIUM: 48,
        PriorityLevel.LOW: 72,
    }

    def calculate_deadline(self, priority: PriorityLevel, start_time: datetime.datetime = None) -> Tuple[int, datetime.datetime]:
        """Calculates SLA deadline from priority level."""
        if not start_time:
            start_time = datetime.datetime.utcnow()
        hours = self.DEFAULT_SLA_HOURS.get(priority, 48)
        deadline = start_time + datetime.timedelta(hours=hours)
        return hours, deadline

    def get_sla_status(self, deadline: datetime.datetime) -> Tuple[float, bool, str]:
        """
        Calculates remaining seconds, breach status, and human readable remaining time label.
        """
        now = datetime.datetime.utcnow()
        delta = (deadline - now).total_seconds()
        is_breached = delta <= 0
        
        if is_breached:
            abs_seconds = abs(delta)
            hrs = int(abs_seconds // 3600)
            mins = int((abs_seconds % 3600) // 60)
            label = f"SLA BREACHED ({hrs}h {mins}m overdue)"
        else:
            hrs = int(delta // 3600)
            mins = int((delta % 3600) // 60)
            label = f"{hrs}h {mins}m remaining"
            
        return delta, is_breached, label

sla_engine = SLAEngine()
