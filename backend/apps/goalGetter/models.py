from django.db import models


class Priority(models.Model):
    priority = models.CharField(verbose_name='Название', max_length=128)

    class Meta:
        verbose_name = 'Приоритет'
        verbose_name_plural = 'Приоритеты'

    def __str__(self):
        return self.priority


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


class Goal(models.Model):
    title = models.CharField(verbose_name='Название', max_length=128)
    description = models.CharField(verbose_name='Описание', max_length=512, blank=True, null=True)
    deadline = models.DateField(verbose_name='Срок выполнения')
    done = models.BooleanField(verbose_name='Выполнено')
    category = models.ForeignKey(verbose_name='Категория',
                                 to=Category,
                                 on_delete=models.CASCADE,
                                 related_name='goals',
                                 blank=True, null=True)
    priority = models.ForeignKey(verbose_name='Приоритет',
                                 to=Priority,
                                 on_delete=models.CASCADE,
                                 related_name='goals',
                                 default=1)
    status = models.ForeignKey(verbose_name='Статус',
                               to=Status,
                               on_delete=models.CASCADE,
                               related_name='goals',
                               default=1)

    class Meta:
        verbose_name = 'Цель'
        verbose_name_plural = 'Цели'

    def __str__(self):
        return self.title
