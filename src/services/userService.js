import api from './api';

const userService = {
    getSettings: async () => {
        const response = await api.get('/user/settings');
        return response.data;
    },

    updateSettings: async (settings) => {
        const response = await api.put('/user/settings', settings);
        return response.data;
    },

    uploadProfileImage: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        
        // Do NOT set Content-Type manually — browser must set it with the correct
        // multipart boundary, otherwise the server can't parse the file parts.
        const response = await api.post('/user/profile-image', formData, {
            headers: {
                'Content-Type': undefined
            }
        });
        return response.data;
    }
};

export default userService;
