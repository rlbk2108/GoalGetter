from django.db import models
from django.utils import timezone

from apps.users.models import User


class Priority(models.Model):
    name = models.CharField(verbose_name='Название', max_length=128)

    class Meta:
        verbose_name = 'Приоритет'
        verbose_name_plural = 'Приоритеты'

    def __str__(self):
        return self.name


class Status(models.Model):
    name = models.CharField(verbose_name='Название', max_length=128)

    class Meta:
        verbose_name = 'Статус'
        verbose_name_plural = 'Статусы'

    def __str__(self):
        return self.name


class Category(models.Model):
    name = models.CharField(verbose_name='Название', max_length=128)

    class Meta:
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'

    def __str__(self):
        return self.name


class Tag(models.Model):
    name = models.CharField(verbose_name='Название', max_length=128)

    class Meta:
        verbose_name = 'Тег'
        verbose_name_plural = 'Теги'

    def __str__(self):
        return self.name


class WeekDays(models.Model):
    name = models.CharField(verbose_name='День недели', max_length=20)

    class Meta:
        verbose_name = 'День недели'
        verbose_name_plural = 'Дни недели'

    def __str__(self):
        return self.name


class Goal(models.Model):
    title = models.CharField(verbose_name='Название', max_length=128)
    description = models.CharField(verbose_name='Описание', max_length=512, blank=True, null=True)
    deadline = models.DateField(verbose_name='Срок выполнения', blank=True, null=True)
    category = models.ForeignKey(verbose_name='Категория',
                                 to=Category,
                                 on_delete=models.CASCADE,
                                 related_name='goal_categories',
                                 blank=True, null=True)
    tag = models.ManyToManyField(verbose_name='Тег',
                                 to=Tag,
                                 related_name='goal_tags',
                                 blank=True)
    priority = models.ForeignKey(verbose_name='Приоритет',
                                 to=Priority,
                                 on_delete=models.CASCADE,
                                 related_name='goal_priorities',
                                 blank=True, null=True)
    status = models.ForeignKey(verbose_name='Статус',
                               to=Status,
                               on_delete=models.CASCADE,
                               related_name='goal_statuses',
                               blank=True, null=True)
    reminder = models.ManyToManyField(verbose_name='Напоминание',
                                      to='WeekDays',
                                      related_name='reminders',
                                      blank=True)
    done = models.BooleanField(verbose_name='Выполнено', default=False)
    user = models.ForeignKey(User, verbose_name="Пользователь", on_delete=models.CASCADE)

    class Meta:
        verbose_name = 'Цель'
        verbose_name_plural = 'Цели'

    def __str__(self):
        return self.title


class History(models.Model):
    goal_title = models.CharField(verbose_name="Название цели", max_length=128)
    user = models.ForeignKey(User, verbose_name="Пользователь", on_delete=models.CASCADE)
    deleted_at = models.DateTimeField(default=timezone.now)

    class Meta:
        verbose_name = 'Удаленная цель'
        verbose_name_plural = 'Удаленные цели'

    def __str__(self):
        return self.goal_title
