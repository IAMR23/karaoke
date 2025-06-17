import React from "react";

export default function Sidebar() {
  return (
    <div>
      <div class="container-fluid">
        <div class="row flex-nowrap">
          <div class="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-primary text-light">
            <div class="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
              <ul
                class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
                id="menu"
              >
                <li class="nav-item">
                  <a href="#" class="nav-link align-middle px-0">
                    <i class="fs-4 bi-house"></i>
                    <span class="ms-1 d-none d-sm-inline text-light">Info</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#submenu1"
                    data-bs-toggle="collapse"
                    class="nav-link px-0 align-middle"
                  >
                    <i class="fs-4 bi-speedometer2"></i>
                    <span class="ms-1 d-none d-sm-inline text-light">
                      Opciones
                    </span>
                  </a>
                  <ul
                    class="collapse show nav flex-column ms-1"
                    id="submenu1"
                    data-bs-parent="#menu"
                  >
                    <li class="w-100">
                      <a href="#" class="nav-link px-0">
                        <span class="d-none d-sm-inline text-light">
                          Canciones
                        </span>
                        1
                      </a>
                    </li>
                    <li>
                      <a href="#" class="nav-link px-0">
                        <span class="d-none d-sm-inline text-light">Item</span>2
                      </a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#" class="nav-link px-0 align-middle">
                    <i class="fs-4 bi-table"></i>
                    <span class="ms-1 d-none d-sm-inline text-light">
                      Solicitudes
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="#submenu2"
                    data-bs-toggle="collapse"
                    class="nav-link px-0 align-middle "
                  >
                    <i class="fs-4 bi-bootstrap"></i>
                    <span class="ms-1 d-none d-sm-inline text-light">
                      Bootstrap
                    </span>
                  </a>
                  <ul
                    class="collapse nav flex-column ms-1"
                    id="submenu2"
                    data-bs-parent="#menu"
                  >
                    <li class="w-100">
                      <a href="#" class="nav-link px-0">
                        <span class="d-none d-sm-inline text-light text-light">
                          Item
                        </span>
                        1
                      </a>
                    </li>
                    <li>
                      <a href="#" class="nav-link px-0">
                        <span class="d-none d-sm-inline text-light">Item</span>2
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
              <div class="dropdown pb-4">
                <a
                  href="#"
                  class="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
                  id="dropdownUser1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src="https://github.com/mdo.png"
                    alt="hugenerd"
                    width="30"
                    height="30"
                    class="rounded-circle"
                  />
                  <span class="d-none d-sm-inline mx-1">loser</span>
                </a>
                <ul
                  class="dropdown-menu dropdown-menu-dark text-small shadow"
                  aria-labelledby="dropdownUser1"
                >
                  <li>
                    <a class="dropdown-item" href="#">
                      New project...
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" href="#">
                      Settings
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" href="#">
                      Profile
                    </a>
                  </li>
                  <li></li>
                  <li>
                    <a class="dropdown-item" href="#">
                      Sign out
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="col py-3">
            <h3>Left Sidebar with Submenus</h3>
            <p class="lead">
              An example 2-level sidebar with collasible menu items. The menu
              functions like an "accordion" where only a single menu is be open
              at a time. While the sidebar itself is not toggle-able, it does
              responsively shrink in width on smaller screens.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
