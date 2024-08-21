using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MadWorldInkWebAPI.Data;
using MadWorldInkWebAPI.Models;
using MadWorldInkWebAPI.Services;
using MadWorldInkWebAPI.Mapping;
using MadWorldInkWebAPI.Repositories.Implementations;
using MadWorldInkWebAPI.Repositories.Interfaces;
using System.Text;
using MadWorldInkWebAPI.Repositories;
using MadWorldInkWebAPI.Services.Interfaces;
using MadWorldInkWebAPI.SchemaFilter;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(option =>
{
    option.SwaggerDoc("v1", new OpenApiInfo { Title = "MADWORLDINK API", Version = "v1" });
    option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter a valid token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "Bearer"
    });
    option.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] { }
        }
    });

    // Register the schema filter
    option.SchemaFilter<FormFileSchemaFilter>();
});

// Configure Identity
builder.Services.AddIdentity<User, IdentityRole<int>>(options =>
{
    options.User.RequireUniqueEmail = true; // Enforces unique emails
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = true;
    options.Password.RequiredLength = 6;
    options.Password.RequiredUniqueChars = 1;
})
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = "MyIssuer",
        ValidAudience = "MyAudience",
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes("Mmx44IfURe84A/c4i0g2eY8m/DEhzUzXyyVPwKIo2SU="))
    };
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IProductRepo, ProductRepo>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<ICartService, CartService>();
builder.Services.AddScoped<ICartRepo, CartRepo>();
builder.Services.AddScoped<IOrderRepo, OrderRepo>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddAutoMapper(typeof(MappingProfile));
builder.Services.AddSingleton<IWebHostEnvironment>(builder.Environment);
builder.Services.AddScoped<TokenService>();

var app = builder.Build();

// Create roles if they don't exist
using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<int>>>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();

    var roles = new[] { "Client", "Admin" };

    foreach (var role in roles)
    {
        if (!await roleManager.RoleExistsAsync(role))
        {
            await roleManager.CreateAsync(new IdentityRole<int>(role));
        }
    }

    // Optionally, create an admin user if it doesn't exist
    var adminUser = await userManager.FindByNameAsync("admin");
    if (adminUser == null)
    {
        var user = new User { UserName = "admin", Email = "admin@example.com" };
        await userManager.CreateAsync(user, "Admin123!");

        await userManager.AddToRoleAsync(user, "Admin");
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(builder => builder
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader());

app.UseHttpsRedirection();
app.UseStaticFiles(); // Ensure this line is present to serve static files

app.UseAuthentication();
app.UseAuthorization();

app.UseStaticFiles();
app.MapControllers();

app.Run();
