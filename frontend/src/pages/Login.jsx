function Login() {
  return (
    <div className="container form-page">
      <h1>Login</h1>

      <form>
        <input
          type="email"
          placeholder="Email"
        />

        <input
          type="password"
          placeholder="Password"
        />

        <button>
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;