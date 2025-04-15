const initialData = {
    users: {
      1: {
        id: 1,
        name: "Ana Silva",
        photo_url: "https://example.com/photos/ana.jpg",
        password_hash: "hash123",
        hashtag: "ana_silva",
        created_at: "2025-04-14 16:46:52.272318"
      },
      2: {
        id: 2,
        name: "Carlos Pereira",
        photo_url: "https://example.com/photos/carlos.jpg",
        password_hash: "hash456",
        hashtag: "carlos_p",
        created_at: "2025-04-14 16:46:52.272331"
      }
    },
    roles: {
      1: {
        id: 1,
        user_id: 1,
        role_name: "Teacher",
        role_hashtag: "teacher_ana"
      },
      2: {
        id: 2,
        user_id: 2,
        role_name: "Student",
        role_hashtag: "student_carlos"
      }
    },
    groups: {
      1: {
        id: 1,
        user_id: 1,
        name: "ADS Study Group",
        hashtag: "ads_group",
        description: "Group for programming questions.",
        is_public: true,
        auto_admission: false,
        created_at: "2025-04-14 16:46:52.272337"
      },
      2: {
        id: 2,
        user_id: 2,
        name: "DM Study Group",
        hashtag: "dm_group",
        description: "Group for programming questions.",
        is_public: true,
        auto_admission: false,
        created_at: "2025-04-14 16:46:52.272337"
      }
    },
    group_users: {
      1: {
        id: 1,
        group_id: 1,
        user_id: 2,
        status: "pending",
        request_message: "I would like to join the group.",
        created_at: "2025-04-14 16:46:52.272343"
      }
    },
    availabilities: {
      1: {
        id: 1,
        user_id: 1,
        role_id: 1,
        group_id: 1,
        start_date: "2025-04-15T14:00:00",
        end_date: "2025-04-15T16:00:00",
        location: "Room 101 - IPB",
        is_geolocated: false,
        latitude: null,
        longitude: null,
        radius: null,
        periodicity: "unique",
        created_at: "2025-04-14 16:46:52.272348"
      },
      2: {
        id: 2,
        user_id: 1,
        role_id: 1,
        group_id: 2,
        start_date: "2025-04-15T14:00:00",
        end_date: "2025-04-15T16:00:00",
        location: "Room 101 - IPB",
        is_geolocated: false,
        latitude: null,
        longitude: null,
        radius: null,
        periodicity: "unique",
        created_at: "2025-04-14 16:46:52.272348"
      },
      3: {
        id: 3,
        user_id: 1,
        role_id: 1,
        group_id: 2,
        start_date: "2025-04-15T14:00:00",
        end_date: "2025-04-15T16:00:00",
        location: "Room 101 - IPB",
        is_geolocated: false,
        latitude: null,
        longitude: null,
        radius: null,
        periodicity: "unique",
        created_at: "2025-04-14 16:46:52.272348"
      },
      4: {
        id: 4,
        user_id: 2,
        role_id: 1,
        group_id: 2,
        start_date: "2025-04-15T14:00:00",
        end_date: "2025-04-15T16:00:00",
        location: "Room 101 - IPB",
        is_geolocated: false,
        latitude: null,
        longitude: null,
        radius: null,
        periodicity: "unique",
        created_at: "2025-04-14 16:46:52.272348"
      },
      5: {
        id: 5,
        user_id: 1,
        role_id: 1,
        group_id: 1,
        start_date: "2025-04-15T14:00:00",
        end_date: "2025-04-15T16:00:00",
        location: "Room 101 - IPB",
        is_geolocated: false,
        latitude: null,
        longitude: null,
        radius: null,
        periodicity: "unique",
        created_at: "2025-04-14 16:46:52.272348"
      },
      6: {
        id: 6,
        user_id: 1,
        role_id: 1,
        group_id: 2,
        start_date: "2025-04-15T14:00:00",
        end_date: "2025-04-15T16:00:00",
        location: "Room 101 - IPB",
        is_geolocated: false,
        latitude: null,
        longitude: null,
        radius: null,
        periodicity: "unique",
        created_at: "2025-04-14 16:46:52.272348"
      },
      7: {
        id: 7,
        user_id: 1,
        role_id: 1,
        group_id: 2,
        start_date: "2025-04-15T14:00:00",
        end_date: "2025-04-15T16:00:00",
        location: "Room 101 - IPB",
        is_geolocated: false,
        latitude: null,
        longitude: null,
        radius: null,
        periodicity: "unique",
        created_at: "2025-04-14 16:46:52.272348"
      },
      8: {
        id: 8,
        user_id: 2,
        role_id: 1,
        group_id: 2,
        start_date: "2025-04-15T14:00:00",
        end_date: "2025-04-15T16:00:00",
        location: "Room 101 - IPB",
        is_geolocated: false,
        latitude: null,
        longitude: null,
        radius: null,
        periodicity: "unique",
        created_at: "2025-04-14 16:46:52.272348"
      },
      9: {
        id: 9,
        user_id: 1,
        role_id: 1,
        group_id: 1,
        start_date: "2025-04-15T14:00:00",
        end_date: "2025-04-15T16:00:00",
        location: "Room 101 - IPB",
        is_geolocated: false,
        latitude: null,
        longitude: null,
        radius: null,
        periodicity: "unique",
        created_at: "2025-04-14 16:46:52.272348"
      },
      10: {
        id: 10,
        user_id: 1,
        role_id: 1,
        group_id: 2,
        start_date: "2025-04-15T14:00:00",
        end_date: "2025-04-15T16:00:00",
        location: "Room 101 - IPB",
        is_geolocated: false,
        latitude: null,
        longitude: null,
        radius: null,
        periodicity: "unique",
        created_at: "2025-04-14 16:46:52.272348"
      },
      11: {
        id: 11,
        user_id: 1,
        role_id: 1,
        group_id: 2,
        start_date: "2025-04-15T14:00:00",
        end_date: "2025-04-15T16:00:00",
        location: "Room 101 - IPB",
        is_geolocated: false,
        latitude: null,
        longitude: null,
        radius: null,
        periodicity: "unique",
        created_at: "2025-04-14 16:46:52.272348"
      },
      12: {
        id: 12,
        user_id: 2,
        role_id: 1,
        group_id: 2,
        start_date: "2025-04-15T14:00:00",
        end_date: "2025-04-15T16:00:00",
        location: "Room 101 - IPB",
        is_geolocated: false,
        latitude: null,
        longitude: null,
        radius: null,
        periodicity: "unique",
        created_at: "2025-04-14 16:46:52.272348"
      },
      13: {
        id: 13,
        user_id: 1,
        role_id: 1,
        group_id: 1,
        start_date: "2025-04-15T14:00:00",
        end_date: "2025-04-15T16:00:00",
        location: "Room 101 - IPB",
        is_geolocated: false,
        latitude: null,
        longitude: null,
        radius: null,
        periodicity: "unique",
        created_at: "2025-04-14 16:46:52.272348"
      },
      14: {
        id: 14,
        user_id: 1,
        role_id: 1,
        group_id: 2,
        start_date: "2025-04-15T14:00:00",
        end_date: "2025-04-15T16:00:00",
        location: "Room 101 - IPB",
        is_geolocated: false,
        latitude: null,
        longitude: null,
        radius: null,
        periodicity: "unique",
        created_at: "2025-04-14 16:46:52.272348"
      },
      15: {
        id: 15,
        user_id: 1,
        role_id: 1,
        group_id: 2,
        start_date: "2025-04-15T14:00:00",
        end_date: "2025-04-15T16:00:00",
        location: "Room 101 - IPB",
        is_geolocated: false,
        latitude: null,
        longitude: null,
        radius: null,
        periodicity: "unique",
        created_at: "2025-04-14 16:46:52.272348"
      },
      16: {
        id: 16,
        user_id: 2,
        role_id: 1,
        group_id: 2,
        start_date: "2025-04-15T14:00:00",
        end_date: "2025-04-15T16:00:00",
        location: "Room 101 - IPB",
        is_geolocated: false,
        latitude: null,
        longitude: null,
        radius: null,
        periodicity: "unique",
        created_at: "2025-04-14 16:46:52.272348"
      }
    },
    messages: {
      1: {
        id: 1,
        sender_id: 2,
        receiver_id: 1,
        group_id: 1,
        content: "Hello, are you available tomorrow?",
        created_at: "2025-04-14 16:46:52.272352"
      }
    }
  };
  
  export default initialData;
  