import { axiosInstance } from "./axios";

export const getAuthUser = async () => {
    try {
        const res = await axiosInstance.get("/auth/me");
        return res.data
    } catch (error) {
        console.log("Error in getAuthUser", error);
        return null
    }
}

export const signup = async (registerData)=> {
    const response = await axiosInstance.post("/auth/register", registerData);
    return response.data;
};

export const login = async (loginData)=> {
    const response = await axiosInstance.post("/auth/login", loginData);
    return response.data;
};

export const logout = async ()=> {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
};

export const addQuestion = async (questionData) => {
    const response = await axiosInstance.post("/questions/create", questionData);
    return response.data;   
}


export const searchPlaces = async (query) => {
  const res = await axiosInstance.get(
    `/questions/search?q=${query}`
  );

  return res.data;
};

export const getAllQuestions = async () => {
  const res = await axiosInstance.get("/questions/");
  return res.data;
};

export const questionUpvote = async (questionId) => {
  const res = await axiosInstance.post(`/questions/upvote/${questionId}`);
  return res.data;
};

export const QuestionDownvote = async (questionId) => {
  const res = await axiosInstance.post(`/questions/downvote/${questionId}`);
  return res.data;
};

export const getQuestionById = async (id) => {
  const res = await axiosInstance.get(`/questions/${id}`);
  return res.data;
};

export const addAnswer = async (answerData) => {
    const response = await axiosInstance.post("/answers/create", answerData);
    return response.data;   
}

export const answerUpvote = async (answerId) => {
  const res = await axiosInstance.post(`/answers/upvote/${answerId}`);
  return res.data;
};

export const answerDownvote = async (answerId) => {
  const res = await axiosInstance.post(`/answers/downvote/${answerId}`);
  return res.data;
};

export const getUserProfile = async (id) => {
  const res = await axiosInstance.get(`/users/profile/${id}`);
  return res.data;
};

export const updateUserProfile = async (profileData) => {
  const res = await axiosInstance.put(`/users/profile`, profileData);
  return res.data;
}

export const getUserAnswers = async (userId) => {
  const res = await axiosInstance.get(`/answers/user/${userId}`);
  return res.data;
};

export const deletequestion = async (id) => {
  const res = await axiosInstance.delete(`/questions/user/${id}`);
  return res.data;  
}

export const getUserQuestions = async (userId) => {
  const res = await axiosInstance.get(`/questions/user/${userId}`);
  return res.data;
};

export const updateQuestion = async (id, data) => {
  const res = await axiosInstance.put(`/questions/user/${id}`, data);
  return res.data;
};

export const updateAnswer = async (id, data) => {
  const res = await axiosInstance.put(`/answers/user/${id}`, data);
  return res.data;
};

export const deleteanswer = async (id) => {
  const res = await axiosInstance.delete(`/answers/user/${id}`);
  return res.data;
}

export const changeUserPassword = async (data) => {
  const res = await axiosInstance.put("/users/change-password", data);
  return res.data;
};

export const getLeaderboard = async () => {
  const res = await axiosInstance.get("/leadboard");
  return res.data;
}

export const SaveQuestion = async (questionId) => {
  const res = await axiosInstance.patch(`/users/${questionId}/save`);
  return res.data;
};

export const getSavedQuestions = async (userId) => {
  const res = await axiosInstance.get(`/users/saved-questions/${userId}`);
  return res.data.savedQuestions;
};

export const incrementQuestionView = async (questionId) => {
  const res = await axiosInstance.post(
    `/questions/${questionId}/view`
  );
  return res.data;
};

// FORGOT PASSWORD
export const forgotPassword = async (email) => {
  const res = await axiosInstance.post("/auth/forgot-password", {
    email,
  });
  return res.data;
};

// RESET PASSWORD
export const resetPassword = async ({ token, password }) => {
  const res = await axiosInstance.post(
    `/auth/reset-password/${token}`,
    { password }
  );

  return res.data;
};