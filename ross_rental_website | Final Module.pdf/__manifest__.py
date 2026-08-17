{
    'name': 'Ross Rental Website',
    'summary': 'Custom static marketing website for Ross Rental Cars (Suriname & Curaçao)',
    'description': """
Ross Rental Website
====================
Static, content-only website for Ross Rental Cars, built to match the
approved mockup (ross_mockup.html): home page, fleet showcase page, and a
fully custom header/footer/theme layered on top of the standard Odoo
website module.

This module only depends on `website` — it renders static content (no
`sale_renting` / `website_sale` / product wiring). That integration is a
separate follow-up step.
""",
    'category': 'Website',
    'version': '18.0.1.0.0',
    'author': 'Ksolves',
    'license': 'LGPL-3',
    'depends': ['website'],
    'data': [
        'views/website_layout.xml',
        'views/snippet_templates.xml',
        'views/home_templates.xml',
        'views/fleet_templates.xml',
        'data/website_page_data.xml',
        'data/website_menu_data.xml',
    ],
    'assets': {
        'web.assets_frontend': [
            'ross_rental_website/static/src/scss/ross_rental.scss',
            'ross_rental_website/static/src/js/ross_rental.js',
        ],
    },
    'installable': True,
    'application': False,
}
