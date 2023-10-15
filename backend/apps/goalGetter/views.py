from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.generics import ListAPIView, ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import (GoalCreateSerializers, TagSerializers, CategorySerializers, PrioritySerializers,
                          StatusSerializers, WeekDaysSerializers)
from .models import Goal, Tag, Category, Priority, Status, WeekDays


class GoalCreatAPIView(ListCreateAPIView):
    queryset = Goal.objects.all()
    serializer_class = GoalCreateSerializers


class GoalDetailAPIView(RetrieveUpdateDestroyAPIView):
    serializer_class = GoalCreateSerializers
    queryset = Goal.objects.all()
    lookup_field = 'id'


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


class PrintTokenAPIView(APIView):
    permission_classes = [AllowAny]  # Только для аутентифицированных пользователей

    def get(self, request):
        # Доступ к токену пользователя
        token = request.auth
        print("Access Token:", token)

        # Возвращаем какой-то ответ, например, пустой JSON
        return Response({})