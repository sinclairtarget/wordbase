from setuptools import setup

setup(
    name='wordbase_backend',
    packages=['wordbase_backend'],
    include_package_data=True,
    install_requires=[
        'click==6.7',
        'Flask==0.12.2',
        'itsdangerous==0.24',
        'Jinja2==2.9.6',
        'MarkupSafe==1.0',
        'Werkzeug==0.12.2'
    ]
)