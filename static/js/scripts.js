const content_dir = 'contents/'
const config_file = 'config.yml'
const section_names = ['home', 'articles', 'projects','privacy']


window.addEventListener('DOMContentLoaded', event => {

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });


    // Yaml
    fetch(content_dir + config_file + "?v=" + new Date().getTime())
        .then(response => response.text())
        .then(text => {
            const yml = jsyaml.load(text);
            Object.keys(yml).forEach(key => {
                const element = document.getElementById(key);
                if (element) {
                    element.innerHTML = yml[key];
                }
            });
        })
        .catch(error => console.log(error));


    // Marked
    marked.use({ mangle: false, headerIds: false })
    section_names.forEach((name, idx) => {
        const elementId = name + '-md';
        const element = document.getElementById(elementId);
        
        if (!element) {
            return;
        }

        fetch(content_dir + name + '.md')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${name}.md: ${response.status} ${response.statusText}`);
                }
                return response.text();
            })
            .then(markdown => {
                const html = marked.parse(markdown);
                element.innerHTML = html;
                // MathJax
                MathJax.typeset();
            })
            .catch(error => {
                console.error(`Error loading ${name}.md:`, error);
                element.innerHTML = `<p class="text-danger">Error loading content: ${error.message}</p>`;
            });
    });

}); 
