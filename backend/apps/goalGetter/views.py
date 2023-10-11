from rest_framework.permissions import AllowAny
from rest_framework.generics import ListAPIView, ListCreateAPIView
from .serializers import (GoalCreateSerializers, TagSerializers, CategorySerializers, PrioritySerializers,
                          StatusSerializers, WeekDaysSerializers)
from .models import Goal, Tag, Category, Priority, Status, WeekDays


class GoalCreatAPIView(ListCreateAPIView):
    permission_classes = [AllowAny]
    queryset = Goal.objects.all()
    serializer_class = GoalCreateSerializers


class TagAPIView(ListAPIView):
    permission_classes = [AllowAny]
    queryset = Tag.objects.all()
    serializer_class = TagSerializers


class CategoryAPIView(ListAPIView):
    permission_classes = [AllowAny]
    queryset = Category.objects.all()
    serializer_class = CategorySerializers

class PriorityAPIView(ListAPIView):
    permission_classes = [AllowAny]
    queryset = Priority.objects.all()
    serializer_class = PrioritySerializers


class StatusAPIView(ListAPIView):
    permission_classes = [AllowAny]
    queryset = Status.objects.all()
    serializer_class = StatusSerializers


class WeekdaysAPIView(ListAPIView):
    permission_classes = [AllowAny]
    queryset = WeekDays.objects.all()
    serializer_class = WeekDaysSerializers
