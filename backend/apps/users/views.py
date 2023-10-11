from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from apps.users.models import User
from rest_framework import response, status
from .serializers import UserCreateSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class UserCreateAPIView(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        login = request.data.get('login')

        if User.objects.filter(email=email).exists():
            return Response('A user with this email already exists', status=status.HTTP_400_BAD_REQUEST)

        elif User.objects.filter(login=login).exists():
            return Response('A user with this login already exists', status=status.HTTP_400_BAD_REQUEST)

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return response.Response('User was successfully created', status=status.HTTP_201_CREATED)
        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


