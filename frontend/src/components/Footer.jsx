import logo from "../assets/apapa-logo.png";


const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-b from-white to-primary/5">
      <div className="mx-auto max-w-7xl px-6 py-16">

        <div className="grid md:grid-cols-4 gap-10">

          {/* LEFT */}
          <div className="md:col-span-2">

            {/* LOGO */}
            <a href="#" className="flex items-center gap-3">
              <img
                src={logo}
                alt="Apapa logo"
                className="h-24 w-auto object-contain"
              />
            </a>

            {/* TEXT */}
            <p className="mt-4 text-sm text-muted-foreground max-w-sm leading-relaxed">
              Place intelligence for everyone. Search any location and see real answers from people who actually know it.
            </p>

            {/* SOCIALS (clean minimal) */}
            <div className="mt-6 flex items-center gap-3">
              {["T", "I", "G"].map((s, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 grid place-items-center rounded-full bg-white/70 backdrop-blur-md shadow hover:shadow-md hover:-translate-y-1 transition-all text-primary font-semibold"
                >
                  {s}
                </a>
              ))}
            </div>

          </div>

          {/* LINKS */}
          {[
            { title: "Product", links: ["Places", "Questions", "How it works", "For locals"] },
            { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold text-sm text-primary">
                {col.title}
              </h4>

              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* BOTTOM */}
        <div className="mt-12 pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">

          <p>
            © {new Date().getFullYear()} Apapa. Know a place before you go.
          </p>

          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Cookies</a>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;