
const initialData = {
    users: {
        1: {
            id: 1,
            name: "John Smith",
            photo_url: "https://example.com/photos/john_smith.jpg",
            password_hash: "hash123",
            hashtag: "john_smith",
            created_at: "2025-04-14T16:46:52.272318"
        },
        2: {
            id: 2,
            name: "Alice Johnson",
            photo_url: "https://example.com/photos/alice_johnson.jpg",
            password_hash: "hash456",
            hashtag: "alice_j",
            created_at: "2025-04-14T16:46:52.272331"
        },
        3: {
            id: 3,
            name: "David Lee",
            photo_url: "https://example.com/photos/david_lee.jpg",
            password_hash: "hash789",
            hashtag: "david_lee",
            created_at: "2025-04-18T09:15:12.102000"
        },
        4: {
            id: 4,
            name: "Maria García",
            photo_url: "https://example.com/photos/maria_garcia.jpg",
            password_hash: "hashabc",
            hashtag: "maria_g",
            created_at: "2025-04-18T09:16:47.657000"
        },
        5: {
            id: 5,
            name: "Tomokazu Sato",
            photo_url: "https://example.com/photos/tomokazu_sato.jpg",
            password_hash: "hashdef",
            hashtag: "tomo_sato",
            created_at: "2025-04-18T09:17:59.425000"
        }
    },

    roles: {
        1: {id: 1, role_name: "Teacher", role_hashtag: "teacher"},
        2: {id: 2, role_name: "Student", role_hashtag: "student"},
        3: {id: 3, role_name: "Teaching Assistant", role_hashtag: "teaching_assistant"},
        4: {id: 4, role_name: "Mentor", role_hashtag: "mentor"}
    },

    user_has_role: {
        1: {id: 1, user_id: 1, role_id: 1}, // John → Teacher
        2: {id: 2, user_id: 2, role_id: 2}, // Alice → Student
        3: {id: 3, user_id: 4, role_id: 2}, // Maria → Student
        4: {id: 4, user_id: 3, role_id: 3}, // David → Teaching Assistant
        5: {id: 5, user_id: 5, role_id: 4}, // Tomokazu → Mentor

        6: {id: 6, user_id: 1, role_id: 4}, // John → Mentor as well
        7: {id: 7, user_id: 3, role_id: 2}, // David → Student too
        8: {id: 8, user_id: 5, role_id: 1}  // Tomokazu → Teacher too
    },

    groups: {
        1: {
            id: 1,
            user_id: 1,
            name: "Algorithms Group",
            hashtag: "algorithms_group",
            description: "Group for discussing algorithm problems.",
            is_public: true,
            auto_admission: false,
            created_at: "2025-04-14T16:46:52.272337"
        },
        2: {
            id: 2,
            user_id: 2,
            name: "Data Structures Group",
            hashtag: "ds_group",
            description: "Group for data structure exercises.",
            is_public: true,
            auto_admission: false,
            created_at: "2025-04-14T16:46:52.272337"
        },
        3: {
            id: 3,
            user_id: 1,
            name: "Databases Group",
            hashtag: "db_group",
            description: "Discuss SQL and NoSQL database design.",
            is_public: true,
            auto_admission: true,
            created_at: "2025-04-18T09:20:00.000000"
        },
        4: {
            id: 4,
            user_id: 4,
            name: "Frontend Devs",
            hashtag: "frontend_group",
            description: "HTML/CSS/JS and modern frameworks.",
            is_public: false,
            auto_admission: false,
            created_at: "2025-04-18T09:21:00.000000"
        },
        5: {
            id: 5,
            user_id: 5,
            name: "Career Mentoring",
            hashtag: "career_group",
            description: "Career guidance and interview prep.",
            is_public: true,
            auto_admission: true,
            created_at: "2025-04-18T09:22:00.000000"
        }
    },

    group_users: {
        1: {
            id: 1,
            group_id: 1,
            user_id: 2,
            status: "approved",
            request_message: "Excited to learn algorithms!",
            created_at: "2025-04-18T09:25:00.000000"
        },
        2: {
            id: 2,
            group_id: 1,
            user_id: 3,
            status: "pending",
            request_message: "I can help with discussions as TA.",
            created_at: "2025-04-18T09:26:00.000000"
        },
        3: {
            id: 3,
            group_id: 2,
            user_id: 1,
            status: "approved",
            request_message: "Happy to mentor DS topics.",
            created_at: "2025-04-18T09:27:00.000000"
        },
        4: {
            id: 4,
            group_id: 3,
            user_id: 2,
            status: "approved",
            request_message: null,
            created_at: "2025-04-18T09:28:00.000000"
        },
        5: {
            id: 5,
            group_id: 5,
            user_id: 4,
            status: "pending",
            request_message: "Looking for career advice.",
            created_at: "2025-04-18T09:29:00.000000"
        },
        6: {
            id: 6,
            group_id: 4,
            user_id: 1,
            status: "approved",
            request_message: null,
            created_at: "2025-04-18T09:30:00.000000"
        }
    },

    availabilities: {
        1: {
            id: 1,
            user_id: 1,
            role_id: 1,
            group_id: 1,
            start_date: "2025-04-21T14:00:00",
            end_date: "2025-04-21T16:00:00",
            location: "Room 101 - University",
            is_geolocated: false,
            latitude: null,
            longitude: null,
            radius: null,
            periodicity: "unique",
            created_at: "2025-04-18T09:31:00.000000"
        },
        2: {
            id: 2,
            user_id: 2,
            role_id: 2,
            group_id: 1,
            start_date: "2025-04-21T14:00:00",
            end_date: "2025-04-21T16:00:00",
            location: "Room 101 - University",
            is_geolocated: false,
            latitude: null,
            longitude: null,
            radius: null,
            periodicity: "unique",
            created_at: "2025-04-18T09:31:00.000000"
        },
        3: {
            id: 3,
            user_id: 3,
            role_id: 3,
            group_id: 1,
            start_date: "2025-04-22T10:00:00",
            end_date: "2025-04-22T12:00:00",
            location: "Online – Zoom",
            is_geolocated: false,
            latitude: null,
            longitude: null,
            radius: null,
            periodicity: "weekly",
            created_at: "2025-04-18T09:31:00.000000"
        },
        4: {
            id: 4,
            user_id: 4,
            role_id: 2,
            group_id: 4,
            start_date: "2025-04-23T15:00:00",
            end_date: "2025-04-23T17:00:00",
            location: "Library – Study Room 2",
            is_geolocated: false,
            latitude: null,
            longitude: null,
            radius: null,
            periodicity: "unique",
            created_at: "2025-04-18T09:31:00.000000"
        },
        5: {
            id: 5,
            user_id: 5,
            role_id: 4,
            group_id: 5,
            start_date: "2025-04-24T09:00:00",
            end_date: "2025-04-24T11:00:00",
            location: "Career Center – Office 3",
            is_geolocated: false,
            latitude: null,
            longitude: null,
            radius: null,
            periodicity: "biweekly",
            created_at: "2025-04-18T09:31:00.000000"
        },
        // availability for John's Mentor role
        6: {
            id: 6,
            user_id: 1,
            role_id: 4,
            group_id: 5,
            start_date: "2025-04-25T13:00:00",
            end_date: "2025-04-25T15:00:00",
            location: "Career Center – Office 3",
            is_geolocated: false,
            latitude: null,
            longitude: null,
            radius: null,
            periodicity: "unique",
            created_at: "2025-04-18T09:38:00.000000"
        },
        // availability for David's Student role
        7: {
            id: 7,
            user_id: 3,
            role_id: 2,
            group_id: 3,
            start_date: "2025-04-23T11:00:00",
            end_date: "2025-04-23T13:00:00",
            location: "Online – Zoom",
            is_geolocated: false,
            latitude: null,
            longitude: null,
            radius: null,
            periodicity: "unique",
            created_at: "2025-04-18T09:39:00.000000"
        }
    },

    private_messages: {
        1: {
            id: 1,
            sender_id: 2,
            receiver_id: 1,
            group_id: 1,
            content: "Hello, are you available for the algorithms session next Monday?",
            created_at: "2025-04-18T09:32:00.000000"
        },
        2: {
            id: 2,
            sender_id: 1,
            receiver_id: 2,
            group_id: 1,
            content: "Yes, I just posted my available slots. See you then!",
            created_at: "2025-04-18T09:33:00.000000"
        },
        3: {
            id: 3,
            sender_id: 3,
            receiver_id: 1,
            group_id: 1,
            content: "Professor, could you review my TA plan when free?",
            created_at: "2025-04-18T09:34:00.000000"
        },
        4: {
            id: 4,
            sender_id: 4,
            receiver_id: 5,
            group_id: 4,
            content: "Thanks for admitting me to Frontend Devs!",
            created_at: "2025-04-18T09:35:00.000000"
        },
        5: {
            id: 5,
            sender_id: 5,
            receiver_id: 4,
            group_id: 4,
            content: "Welcome Maria – feel free to share your React work anytime.",
            created_at: "2025-04-18T09:36:00.000000"
        },
        6: {
            id: 6,
            sender_id: 5,
            receiver_id: 4,
            group_id: 5,
            content: "I can also mentor you on interview techniques in the Career group.",
            created_at: "2025-04-18T09:36:00.000000"
        },
        7: {
            id: 7,
            sender_id: 1,
            receiver_id: 3,
            group_id: 1,
            content: "David, your TA plan looks good. Just a few tweaks needed on week 3.",
            created_at: "2025-04-18T10:00:00.000000"
        },
        8: {
            id: 8,
            sender_id: 1,
            receiver_id: 4,
            group_id: 5,
            content: "Hi Maria, I saw your request for mentorship. I’ll be available Friday.",
            created_at: "2025-04-18T10:05:00.000000"
        },
        9: {
            id: 9,
            sender_id: 1,
            receiver_id: 5,
            group_id: 5,
            content: "Tomokazu, can we sync about mentoring sessions this week?",
            created_at: "2025-04-18T10:10:00.000000"
        },
        10: {
            id: 10,
            sender_id: 2,
            receiver_id: 1,
            group_id: 2,
            content: "Thanks for the insights in the Data Structures group!",
            created_at: "2025-04-18T10:15:00.000000"
        },
        11: {
            id: 11,
            sender_id: 1,
            receiver_id: 2,
            group_id: 2,
            content: "Anytime! Let me know if you need help with trees and graphs.",
            created_at: "2025-04-18T10:20:00.000000"
        },
        12: {
            id: 12,
            sender_id: 3,
            receiver_id: 1,
            group_id: 1,
            content: "Should I prepare any materials for next week’s session?",
            created_at: "2025-04-18T10:30:00.000000"
        },
        13: {
            id: 13,
            sender_id: 1,
            receiver_id: 3,
            group_id: 1,
            content: "Yes, focus on sorting algorithms and bring some exercises.",
            created_at: "2025-04-18T10:32:00.000000"
        }
    },

    group_messages: {
        // Algorithms Group (group_id: 1) — only John Smith (user_id: 1) can post
        1: {
            id: 1,
            group_id: 1,
            sender_id: 1,
            content: "Welcome to Algorithms Group! Feel free to ask any algorithm questions here.",
            created_at: "2025-04-18T14:00:00.000000"
        },
        2: {
            id: 2,
            group_id: 1,
            sender_id: 1,
            content: "Office hours will be held next Monday at 4 PM in Room 101.",
            created_at: "2025-04-18T14:05:00.000000"
        },

        // Data Structures Group (group_id: 2) — only Alice Johnson (user_id: 2) can post
        3: {
            id: 3,
            group_id: 2,
            sender_id: 2,
            content: "Data Structures Group kickoff today at 3 PM in Lab 5.",
            created_at: "2025-04-18T15:00:00.000000"
        },
        4: {
            id: 4,
            group_id: 2,
            sender_id: 2,
            content: "Please review the binary tree exercises before the meeting.",
            created_at: "2025-04-18T15:10:00.000000"
        },

        // Databases Group (group_id: 3) — only John Smith (user_id: 1) can post
        5: {
            id: 5,
            group_id: 3,
            sender_id: 1,
            content: "Welcome to Databases Group! Next session is Tuesday at 2 PM via Zoom.",
            created_at: "2025-04-18T16:00:00.000000"
        },
        6: {
            id: 6,
            group_id: 3,
            sender_id: 1,
            content: "Please read the SQL indexing article before our next meeting.",
            created_at: "2025-04-18T16:15:00.000000"
        },

        // Frontend Devs (group_id: 4) — only Maria García (user_id: 4) can post
        7: {
            id: 7,
            group_id: 4,
            sender_id: 4,
            content: "Frontend Devs group is now live! Share your React/JS projects here.",
            created_at: "2025-04-18T17:00:00.000000"
        },
        8: {
            id: 8,
            group_id: 4,
            sender_id: 4,
            content: "Remember to follow our style guide and accessibility best practices.",
            created_at: "2025-04-18T17:10:00.000000"
        },

        // Career Mentoring (group_id: 5) — only Tomokazu Sato (user_id: 5) can post
        9: {
            id: 9,
            group_id: 5,
            sender_id: 5,
            content: "Our first mentoring session is scheduled for Friday at 10 AM.",
            created_at: "2025-04-18T18:00:00.000000"
        },
        10: {
            id: 10,
            group_id: 5,
            sender_id: 5,
            content: "Please post any resume or interview questions here beforehand.",
            created_at: "2025-04-18T18:15:00.000000"
        }
    }

};


export default initialData;

