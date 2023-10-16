from django.utils import timezone
from rest_framework import serializers
from .models import Goal, WeekDays, Status, Category, Priority, Tag, History


class WeekDaysSerializers(serializers.ModelSerializer):
    class Meta:
        model = WeekDays
        fields = ['id', 'name']


class StatusSerializers(serializers.ModelSerializer):
    class Meta:
        model = Status
        fields = ['id', 'name']


class CategorySerializers(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class PrioritySerializers(serializers.ModelSerializer):
    class Meta:
        model = Priority
        fields = ['id', 'name']


class TagSerializers(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']


class GoalCreateSerializers(serializers.ModelSerializer):
    deadline = serializers.DateField(allow_null=True, required=False,
                                     format="%Y-%m-%d", input_formats=['%Y-%m-%d', ''])
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Goal
        fields = ['id', 'title', 'description', 'deadline', 'category', 'tag', 'status', 'priority', 'reminder', 'user']

    def validate_deadline(self, value):
        """
        Проверка чтобы отправленный дедлайн был не раньше сегодняшней даты.
        Validate_deadline - отправленный пользователем deadline.
        Вместо deadline можно поставить другое значение если нужно проверить например категорию,
        тогда validate_category. Это работает только для одного значения,
        т.е.если отправить список или словарь будет ошибка. Нужно будет изменить метод.
        """
        if str(value) != "1900-01-01":
            if value and value < timezone.now().date():
                raise serializers.ValidationError("Дедлайн не может быть меньше текущей даты.")
            return value

    def validate_description(self, value):
        """
        Проверка чтобы отправленный описание было меньше 500 символов.
        """
        if len(value) > 500:
            raise serializers.ValidationError("Символов в описании больше 500.")
        return value

    def validate_title(self, value):
        """
        Проверка чтобы отправленное название цели было меньше 120 символов.
        """
        if len(value) > 120:
            raise serializers.ValidationError("Символов в названии больше 120.")
        return value


class HistorySerializers(serializers.ModelSerializer):
    class Meta:
        model = History
        fields = ['id', 'goal_title', 'user', 'deleted_at']


