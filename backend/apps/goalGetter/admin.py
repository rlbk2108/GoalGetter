from django.contrib import admin

from apps.goalGetter.models import Goal, Priority, Status, Category


admin.site.register(Goal)
admin.site.register(Priority)
admin.site.register(Status)
admin.site.register(Category)

