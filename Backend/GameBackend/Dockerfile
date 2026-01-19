FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["GameBackend.csproj", "./"]
RUN dotnet restore "GameBackend.csproj"
COPY . .
RUN dotnet build "GameBackend.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "GameBackend.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 80
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "GameBackend.dll"]
