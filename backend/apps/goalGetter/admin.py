from django.contrib import admin

from apps.goalGetter.models import Goal, Priority, Status, Category, WeekDays, Tag, History


admin.site.register(Goal)
admin.site.register(Priority)
admin.site.register(WeekDays)
admin.site.register(Tag)
admin.site.register(Status)
admin.site.register(Category)
admin.site.register(History)

