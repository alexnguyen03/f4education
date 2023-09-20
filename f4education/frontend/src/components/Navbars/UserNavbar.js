import { Link, NavLink } from "react-router-dom";
import { NavItem } from "reactstrap";
import logo from "../../assets/img/brand/f4Logo.png";
// reactstrap components

const UserNavbar = () => {
  return (
    <>
      <header className="sticky-top t-0 l-0 r-0">
        <nav class="navbar navbar-expand-lg">
          <Link to="/">
            <img
              src={logo}
              width="50px"
              height="50px"
              alt="Logo"
              className="img-fluid"
            />
          </Link>
          <button
            class="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>

          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
              <li class="nav-item">
                <a class="nav-link" href="#">
                  Danh mục
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link">Khóa học</a>
              </li>
            </ul>
            <form class="form-inline my-2 my-lg-0">
              <input
                class="form-control mr-sm-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button
                class="btn btn-outline-success my-2 my-sm-0"
                type="submit"
              >
                Search
              </button>
            </form>
          </div>
        </nav>
      </header>
    </>
  );
};

export default UserNavbar;
