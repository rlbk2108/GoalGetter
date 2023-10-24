from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response

from core.permissions import IsOwner
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.generics import ListAPIView, ListCreateAPIView, RetrieveUpdateDestroyAPIView, CreateAPIView


from .serializers import (GoalCreateSerializers, TagSerializers, CategorySerializers, PrioritySerializers,
                          StatusSerializers, WeekDaysSerializers, HistorySerializers)
from .models import Goal, Tag, Category, Priority, Status, WeekDays, History


class GoalCreatAPIView(ListCreateAPIView):
    serializer_class = GoalCreateSerializers

    def get_queryset(self):
        # Возвращаем только записи, принадлежащие текущему пользователю
        return Goal.objects.filter(user=str(self.request.user.id)).order_by('done')


class GoalDetailAPIView(RetrieveUpdateDestroyAPIView):
    serializer_class = GoalCreateSerializers
    lookup_field = 'id'
    permission_classes = [IsOwner]

    def get_queryset(self):
        # Возвращаем только записи, принадлежащие текущему пользователю
        queryset = Goal.objects.filter(user=str(self.request.user.id))
        return queryset

    def perform_destroy(self, instance):
        print(timezone.now())
        history_data = {
            'goal_title': instance.title,
            'user': instance.user.id,
        }
        history_serializer = HistorySerializers(data=history_data)

        if history_serializer.is_valid(raise_exception=True):
            history_serializer.save()
            instance.delete()
            return Response({'Цель успешно удалена'}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'Цель не удалена'}, status=status.HTTP_204_NO_CONTENT)


class TagAPIView(ListAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializers


class HistoryAPIView(ListAPIView):
    queryset = History.objects.all()
    serializer_class = HistorySerializers


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

