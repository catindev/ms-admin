module.exports = function (request,response,next) {
  const { user_session } = request.cookies;
  next()
  if (!user_session && request.url !== '/') {
    return response.redirect('/');
  }else if (user_session && request.url === '/') {
    response.redirect('/accounts');
  }
}
