import * as React from "react";

export function NavBar() {
  return (
    <header role="banner" className="pf-c-page__header">
      <div className="pf-c-page__header-brand">
        <div className="pf-c-page__header-brand-toggle">
          <button
            className="pf-c-button pf-m-plain"
            id="page-layout-expandable-nav-nav-toggle"
            aria-label="Global navigation"
            aria-expanded="true"
            aria-controls="page-layout-expandable-nav-expandable-nav"
          >
            <i className="fas fa-bars" aria-hidden="true" />
          </button>
        </div>
        <a className="pf-c-page__header-brand-link">
          <img
            className="pf-c-brand"
            src="https://pf4.patternfly.org//assets/images/l_pf-reverse-164x11.png"
            alt="Patternfly Logo"
          />
        </a>
      </div>
      <div className="pf-c-page__header-tools">
        <div className="pf-c-page__header-tools-group pf-m-icons pf-screen-reader">
          <button className="pf-c-button pf-m-plain" aria-label="Alerts">
            <i className="fas fa-bell" aria-hidden="true" />
          </button>
          <button className="pf-c-button pf-m-plain" aria-label="Settings">
            <i className="fas fa-cog" aria-hidden="true" />
          </button>
        </div>
        <div className="pf-c-page__header-tools-group">
          <div className="pf-m-user pf-screen-reader">
            <div className="pf-c-dropdown">
              <button
                className="pf-c-dropdown__toggle pf-m-plain"
                id="page-layout-expandable-nav-dropdown-button"
                aria-expanded="false"
              >
                <span className="pf-c-dropdown__toggle-text">Tiago Bento</span>
                <i className="fas fa-caret-down pf-c-dropdown__toggle-icon" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
        <img
          className="pf-c-avatar"
          src="https://pf4.patternfly.org//assets/images/img_avatar.svg"
          alt="Avatar Image"
        />
      </div>
    </header>
  );
}
