-- Create Users Table
CREATE TABLE Users (
    id INT PRIMARY KEY IDENTITY(1,1),
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(100),
    company VARCHAR(150),
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME DEFAULT GETDATE()
);

-- Create Services Table
CREATE TABLE Services (
    id INT PRIMARY KEY IDENTITY(1,1),
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    icon VARCHAR(50),
    shortDescription TEXT,
    fullDescription TEXT,
    details TEXT,
    tags VARCHAR(MAX),
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME DEFAULT GETDATE()
);

-- Create Bookings Table
CREATE TABLE Bookings (
    id INT PRIMARY KEY IDENTITY(1,1),
    userId INT NOT NULL FOREIGN KEY REFERENCES Users(id),
    serviceId INT FOREIGN KEY REFERENCES Services(id),
    preferredDate DATE NOT NULL,
    preferredTime VARCHAR(10) NOT NULL,
    status VARCHAR(20) DEFAULT 'Pending',
    message TEXT,
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME DEFAULT GETDATE()
);

-- Create Available Slots Table
CREATE TABLE AvailableSlots (
    id INT PRIMARY KEY IDENTITY(1,1),
    slotDate DATE NOT NULL,
    slotTime VARCHAR(10) NOT NULL,
    isBooked BIT DEFAULT 0,
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME DEFAULT GETDATE()
);

-- Create Company Info Table
CREATE TABLE CompanyInfo (
    id INT PRIMARY KEY IDENTITY(1,1),
    companyName VARCHAR(150),
    mission TEXT,
    vision TEXT,
    description TEXT,
    phone VARCHAR(15),
    email VARCHAR(100),
    website VARCHAR(100),
    address VARCHAR(255),
    city VARCHAR(50),
    state VARCHAR(50),
    country VARCHAR(50),
    workingHours VARCHAR(100),
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME DEFAULT GETDATE()
);

-- Insert Initial Services Data
INSERT INTO Services (name, slug, icon, shortDescription, fullDescription, tags) VALUES
('HR Solutions', 'hr-solutions', '📄', 
 'Complete employee lifecycle management', 
 'Complete employee lifecycle management — from hiring documentation through to full & final settlements. We handle the paperwork so you can focus on your business.',
 'Offer Letters,Appointment Letters,Employee Documentation,HR File Management,Confirmation Letters'),

('Payroll Management', 'payroll-management', '💰',
 'Accurate, timely salary processing',
 'Accurate, timely salary processing with full integration of attendance, leave, bonuses, and statutory deductions. Payslips generated and distributed on schedule.',
 'Salary Processing,Payslip Generation,Attendance Integration,Bonus & Incentives,Full & Final Settlement'),

('Statutory Compliance', 'statutory-compliance', '⚖️',
 'Stay fully compliant with all labour laws',
 'Stay fully compliant with all labour laws and statutory obligations. We manage PF, ESI, professional tax, and all monthly/annual returns so you never face penalties.',
 'PF & ESI,Labour Welfare,Monthly Returns,Registrations,Law Advisory'),

('Licences & Registrations', 'licences-registrations', '🏗️',
 'Handle all statutory registrations and licences',
 'We handle all statutory registrations and licences your business requires — including Shop & Establishment Act, BOCW, CLRA, and other applicable licences.',
 'Shop & Establishment,BOCW,CLRA,Contractor Compliance'),

('Employee Lifecycle Management', 'employee-lifecycle', '🔄',
 'Seamless management from onboarding to exit',
 'Seamless management from onboarding to exit. Every stage of the employee journey is handled professionally — documentation, records, and compliance at each step.',
 'Onboarding,Attendance & Leave,Resignation Processing,Relieving & Experience Letters'),

('HR Advisory & Consulting', 'hr-advisory', '📊',
 'Expert guidance on HR policy and strategy',
 'Expert guidance on HR policy, salary structure, labour law compliance strategy, and workforce management best practices — customised to your business needs.',
 'HR Policy,Salary Structuring,Labour Law Advisory,Compliance Strategy');

-- Insert Company Info
INSERT INTO CompanyInfo (companyName, mission, vision, description, phone, email, website, address, city, state, country, workingHours) VALUES
('Vinalax HR Solutions LLP',
 'To simplify HR compliance and payroll management for businesses of all sizes',
 'To be the most trusted HR solutions partner in India',
 'Vinalax HR Solutions LLP is a professional HR, payroll, and labour compliance service organization providing comprehensive workforce management solutions to businesses across industries.',
 '+91 93471 73466',
 'info@vinalaxhrsolutions.com',
 'www.vinalaxhrsolutions.com',
 'Hyderabad, India',
 'Hyderabad',
 'Telangana',
 'India',
 'Mon – Sat, 9:00 AM – 6:00 PM IST');

-- Insert Sample Available Slots (Next 30 days)
DECLARE @i INT = 0;
DECLARE @date DATE = DATEADD(day, 1, CAST(GETDATE() AS DATE));

WHILE @i < 30
BEGIN
    IF DATENAME(WEEKDAY, @date) NOT IN ('Sunday', 'Saturday')
    BEGIN
        INSERT INTO AvailableSlots (slotDate, slotTime) VALUES
        (@date, '09:00 AM'),
        (@date, '10:00 AM'),
        (@date, '11:00 AM'),
        (@date, '12:00 PM'),
        (@date, '02:00 PM'),
        (@date, '04:00 PM');
    END
    SET @date = DATEADD(day, 1, @date);
    SET @i = @i + 1;
END;
