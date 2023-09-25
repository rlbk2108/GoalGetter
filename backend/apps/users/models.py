from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, Group, Permission
from apps.users.managers import UserManager


class User(AbstractBaseUser, PermissionsMixin):
    first_name = models.CharField(verbose_name='Имя', max_length=128)
    last_name = models.CharField(verbose_name='Фамилия', max_length=128)
    email = models.EmailField(verbose_name='Почта', unique=True)
    login = models.CharField(verbose_name='Логин', max_length=50)
    is_active = models.BooleanField(verbose_name='Активный', default=True)
    is_staff = models.BooleanField(verbose_name='Сотрудник', default=False)

    groups = models.ManyToManyField(Group, verbose_name='Groups', blank=True, related_name='user_set_custom')
    user_permissions = models.ManyToManyField(Permission, verbose_name='User Permissions', blank=True, related_name='user_set_custom')

    USERNAME_FIELD = 'email'

    objects = UserManager()

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'

    def __str__(self):
        return f'{self.email}'
