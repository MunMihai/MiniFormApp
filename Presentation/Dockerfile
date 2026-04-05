FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy everything and publish the Presentation project
COPY . .
WORKDIR /src/Presentation
RUN dotnet restore
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
# Compatibilitate OpenSSL 3.x cu MongoDB Atlas (scade security level)
RUN sed -i 's/^\(CipherString\s*=\s*DEFAULT@SECLEVEL=\)2/\11/' /etc/ssl/openssl.cnf 2>/dev/null || true \
    && sed -i 's/^\(MinProtocol\s*=\s*\)TLSv1.2/\1TLSv1/' /etc/ssl/openssl.cnf 2>/dev/null || true
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:80
EXPOSE 80

ENTRYPOINT ["dotnet", "Presentation.dll"]
