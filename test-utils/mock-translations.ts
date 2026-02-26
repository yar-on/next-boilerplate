/**
 * Mock translations for testing i18n functionality
 */

export const mockEnTranslations = {
    preview: {
        demos: {
            dashboard: {
                brand: 'DashApp',
                title: 'Dashboard',
                search: 'Search...',
                openDrawer: 'Open drawer',
                menu: {
                    profile: 'Profile',
                    settings: 'Settings',
                    logout: 'Logout',
                },
                nav: {
                    dashboard: 'Dashboard',
                    analytics: 'Analytics',
                    users: 'Users',
                    settings: 'Settings',
                },
                metrics: {
                    revenue: 'Total Revenue',
                    orders: 'New Orders',
                    users: 'Active Users',
                    conversion: 'Conversion Rate',
                },
                charts: {
                    revenuePlaceholder: '[Revenue Chart Placeholder]',
                    trafficPlaceholder: '[Traffic Chart Placeholder]',
                },
                activity: {
                    title: 'Recent Activity',
                    headers: {
                        user: 'User',
                        action: 'Action',
                        time: 'Time',
                        status: 'Status',
                    },
                    rows: {
                        johnDoe: {
                            user: 'John Doe',
                            action: 'Created new project',
                            timestamp: '2 hours ago',
                            status: 'Completed',
                        },
                        janeSmith: {
                            user: 'Jane Smith',
                            action: 'Updated user profile',
                            timestamp: '4 hours ago',
                            status: 'In Progress',
                        },
                        bobJohnson: {
                            user: 'Bob Johnson',
                            action: 'Submitted report',
                            timestamp: '6 hours ago',
                            status: 'Completed',
                        },
                        aliceWilliams: {
                            user: 'Alice Williams',
                            action: 'Uploaded documents',
                            timestamp: '8 hours ago',
                            status: 'Pending',
                        },
                    },
                    statuses: {
                        completed: 'Completed',
                        inProgress: 'In Progress',
                        pending: 'Pending',
                    },
                },
            },
            companyOverview: {
                brand: 'BuildCo',
                hero: {
                    title: "Building Tomorrow's Spaces Today",
                    subtitle: 'Award-winning architecture and construction services',
                    cta: 'View Our Work',
                },
                stats: {
                    projects: 'Projects Completed',
                    projectsValue: '500+',
                },
                contact: {
                    title: 'Get In Touch',
                    form: {
                        firstName: 'First Name',
                        email: 'Email',
                    },
                },
            },
            crm: {
                brand: 'CRM Pro',
                title: 'Leads',
                openDrawer: 'Open drawer',
                nav: {
                    leads: 'Leads',
                    deals: 'Deals',
                    settings: 'Settings',
                },
                filters: {
                    all: 'All',
                    new: 'New',
                },
                sorting: {
                    label: 'Sort By',
                    name: 'Name',
                },
                table: {
                    headers: {
                        name: 'Name',
                        company: 'Company',
                        email: 'Email',
                        status: 'Status',
                        value: 'Value',
                    },
                },
                drawer: {
                    title: 'Lead Details',
                    close: 'Close',
                },
            },
        },
        errors: {
            invalidDemo: 'Invalid demo type',
            validDemos: 'Valid demos: company-overview, dashboard, crm',
        },
    },
};

export const mockHeTranslations = {
    preview: {
        demos: {
            dashboard: {
                brand: 'DashApp',
                title: 'לוח בקרה',
                search: 'חיפוש...',
                openDrawer: 'פתח תפריט',
                menu: {
                    profile: 'פרופיל',
                    settings: 'הגדרות',
                    logout: 'התנתק',
                },
                nav: {
                    dashboard: 'לוח בקרה',
                    analytics: 'אנליטיקה',
                    users: 'משתמשים',
                    settings: 'הגדרות',
                },
                metrics: {
                    revenue: 'סך הכנסות',
                    orders: 'הזמנות חדשות',
                    users: 'משתמשים פעילים',
                    conversion: 'שיעור המרה',
                },
                charts: {
                    revenuePlaceholder: '[מציין מקום לתרשים הכנסות]',
                    trafficPlaceholder: '[מציין מקום לתרשים תעבורה]',
                },
                activity: {
                    title: 'פעילות אחרונה',
                    headers: {
                        user: 'משתמש',
                        action: 'פעולה',
                        time: 'זמן',
                        status: 'סטטוס',
                    },
                    rows: {
                        johnDoe: {
                            user: "ג'ון דו",
                            action: 'יצר פרויקט חדש',
                            timestamp: 'לפני שעתיים',
                            status: 'הושלם',
                        },
                        janeSmith: {
                            user: "ג'יין סמית",
                            action: 'עדכן פרופיל משתמש',
                            timestamp: 'לפני 4 שעות',
                            status: 'בתהליך',
                        },
                        bobJohnson: {
                            user: "בוב ג'ונסון",
                            action: 'הגיש דוח',
                            timestamp: 'לפני 6 שעות',
                            status: 'הושלם',
                        },
                        aliceWilliams: {
                            user: 'אליס ויליאמס',
                            action: 'העלה מסמכים',
                            timestamp: 'לפני 8 שעות',
                            status: 'ממתין',
                        },
                    },
                    statuses: {
                        completed: 'הושלם',
                        inProgress: 'בתהליך',
                        pending: 'ממתין',
                    },
                },
            },
            companyOverview: {
                brand: 'BuildCo',
                hero: {
                    title: 'בונים את המרחבים של מחר היום',
                    subtitle: 'שירותי אדריכלות ובנייה עטורי פרסים',
                    cta: 'צפה בעבודות שלנו',
                },
                stats: {
                    projects: 'פרויקטים שהושלמו',
                    projectsValue: '500+',
                },
                contact: {
                    title: 'צור קשר',
                    form: {
                        firstName: 'שם פרטי',
                        email: 'אימייל',
                    },
                },
            },
            crm: {
                brand: 'CRM Pro',
                title: 'לידים',
                openDrawer: 'פתח תפריט',
                nav: {
                    leads: 'לידים',
                    deals: 'עסקאות',
                    settings: 'הגדרות',
                },
                filters: {
                    all: 'הכל',
                    new: 'חדש',
                },
                sorting: {
                    label: 'מיין לפי',
                    name: 'שם',
                },
                table: {
                    headers: {
                        name: 'שם',
                        company: 'חברה',
                        email: 'אימייל',
                        status: 'סטטוס',
                        value: 'ערך',
                    },
                },
                drawer: {
                    title: 'פרטי ליד',
                    close: 'סגור',
                },
            },
        },
        errors: {
            invalidDemo: 'סוג דמו לא תקין',
            validDemos: 'דמואים תקינים: company-overview, dashboard, crm',
        },
    },
};
