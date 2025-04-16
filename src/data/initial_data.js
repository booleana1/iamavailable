const initialData = {
  users: {
    1: {
      id: 1,
      name: "John Smith",
      photo_url: "https://example.com/photos/john_smith.jpg",
      password_hash: "hash123",
      hashtag: "john_smith",
      created_at: "2025-04-14 16:46:52.272318"
    },
    2: {
      id: 2,
      name: "Alice Johnson",
      photo_url: "https://example.com/photos/alice_johnson.jpg",
      password_hash: "hash456",
      hashtag: "alice_j",
      created_at: "2025-04-14 16:46:52.272331"
    }
  },
  roles: {
    1: {
      id: 1,
      user_id: 1,
      role_name: "Teacher",
      role_hashtag: "teacher_john"
    },
    2: {
      id: 2,
      user_id: 2,
      role_name: "Student",
      role_hashtag: "student_alice"
    }
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
      created_at: "2025-04-14 16:46:52.272337"
    },
    2: {
      id: 2,
      user_id: 2,
      name: "Data Structures Group",
      hashtag: "ds_group",
      description: "Group for data structure exercises.",
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
      location: "Room 101 - University",
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
      location: "Room 101 - University",
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
      location: "Room 101 - University",
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
      role_id: 2,
      group_id: 2,
      start_date: "2025-04-15T14:00:00",
      end_date: "2025-04-15T16:00:00",
      location: "Room 101 - University",
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
      location: "Room 101 - University",
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
      location: "Room 101 - University",
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
      location: "Room 101 - University",
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
      role_id: 2,
      group_id: 2,
      start_date: "2025-04-15T14:00:00",
      end_date: "2025-04-15T16:00:00",
      location: "Room 101 - University",
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
      location: "Room 101 - University",
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
      location: "Room 101 - University",
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
      location: "Room 101 - University",
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
      role_id: 2,
      group_id: 2,
      start_date: "2025-04-15T14:00:00",
      end_date: "2025-04-15T16:00:00",
      location: "Room 101 - University",
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
      location: "Room 101 - University",
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
      location: "Room 101 - University",
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
      location: "Room 101 - University",
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
      role_id: 2,
      group_id: 2,
      start_date: "2025-04-15T14:00:00",
      end_date: "2025-04-15T16:00:00",
      location: "Room 101 - University",
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
