module.exports = function (request,response,next) {
  const { user_session } = request.cookies;
  if (!user_session && request.url !== '/')return response.redirect('/');
  if (user_session && request.url === '/') return response.redirect('/accounts');
  next();
}
