export default defineEventHandler(async (event) => {
     deleteCookie(event, 'auth');
     return { success: true };
});
