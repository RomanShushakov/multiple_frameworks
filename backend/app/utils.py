# external imports
from babel.plural import PluralRule


# custom filters for Jinja2
def plural_formatting(languages, key_value, input, locale):
    key = ""
    for i in languages[locale]:
        if(key_value == languages[locale][i]):
            key = i
            break

    if not key:
        return key_value

    plural_key = f"{key}_plural"
    
    plural_rule = PluralRule({"one": "n in 0..1"})

    if(plural_rule(input) != "one" and plural_key in languages[locale]):
        key = plural_key

    return languages[locale][key]
