from django.urls import path
from events.views import EventListCreateView, MyEventsListView, CategoryListCreateView

urlpatterns = [
    path("categories/", CategoryListCreateView.as_view(), name="category-list"),
    path("", EventListCreateView.as_view(), name="event-list"),
    path("my/", MyEventsListView.as_view(), name="my-events-list"),
]
