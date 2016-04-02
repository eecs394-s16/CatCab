
window.localStorage.setItem("__ag:data:session", JSON.stringify({
  access_token: "<%= config.authToken %>",
  user_details: {
    id: <%= config.userId %>
  }
}));
