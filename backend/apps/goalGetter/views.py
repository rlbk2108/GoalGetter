from core.permissions import IsOwner
from rest_framework.generics import ListAPIView, ListCreateAPIView, RetrieveUpdateDestroyAPIView


from .serializers import (GoalCreateSerializers, TagSerializers, CategorySerializers, PrioritySerializers,
                          StatusSerializers, WeekDaysSerializers)
from .models import Goal, Tag, Category, Priority, Status, WeekDays


class GoalCreatAPIView(ListCreateAPIView):
    serializer_class = GoalCreateSerializers

    def get_queryset(self):
        # Возвращаем только записи, принадлежащие текущему пользователю
        return Goal.objects.filter(user=str(self.request.user.id))


class GoalDetailAPIView(RetrieveUpdateDestroyAPIView):
    serializer_class = GoalCreateSerializers
    lookup_field = 'id'
    permission_classes = [IsOwner]

    def get_queryset(self):
        # Возвращаем только записи, принадлежащие текущему пользователю
        queryset = Goal.objects.filter(user=str(self.request.user.id))
        return queryset


class TagAPIView(ListAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializers


class CategoryAPIView(ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializers


class PriorityAPIView(ListAPIView):
    queryset = Priority.objects.all()
    serializer_class = PrioritySerializers


class StatusAPIView(ListAPIView):
    queryset = Status.objects.all()
    serializer_class = StatusSerializers


class WeekdaysAPIView(ListAPIView):
    queryset = WeekDays.objects.all()
    serializer_class = WeekDaysSerializers

