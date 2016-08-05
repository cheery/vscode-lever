from bs4 import BeautifulSoup

def wither_in_pain(obj):
    if isinstance(obj, dict):
        out = xml.new_tag("dict")
        for key, val in obj.items():
            keytag = xml.new_tag("key")
            keytag.string = key
            out.append(keytag)
            out.append(wither_in_pain(val))
        return out
    if isinstance(obj, list):
        out = xml.new_tag("array")
        for val in obj:
            out.append(wither_in_pain(val))
        return out
    if isinstance(obj, (str, unicode)):
        out = xml.new_tag("string")
        out.string = obj
        return out
    assert False, "no encoding for this"


bullshit_template = """<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"></plist>"""

xml = BeautifulSoup(bullshit_template, "xml")
config = xml.new_tag("dict")
xml.plist.append(config)

k = xml.new_tag("key")
k.string = "author"
config.append(k)
v = xml.new_tag("string")
v.string = "Henri Tuhola"
config.append(v)

keywords = " ".join((
    "and as assert break class continue elif else except",
    "extends for if import in not or raise return try while"))

xml.plist.append(wither_in_pain({
    "author": "Henri Tuhola",
    "fileTypes": ["lc"],
    "scopeName": "source.lever",
    "name": "Lever",
    "patterns": [
        {
            "name": "keyword",
            "match": r"\b(%s)\b" % keywords.replace(" ", "|"),
        },
        {
            "name": "comment.number-sign",
            "begin": "#",
            "end": r"\n",
        },
        {
            "name": "string.quoted.double",
            "begin": '"',
            "end": '"',
            "patterns": [
                {
                    "name": "constant.character.escape",
                    "match": r"\\."
                }
            ]
        },
        {
            "name": "string.quoted.single",
            "begin": '\'',
            "end": '\'',
            "patterns": [
                {
                    "name": "constant.character.escape",
                    "match": r"\\."
                }
            ]
        },
        {
            "name": "constant.numeric.float",
            "match": r"\b(?i:(\d+\.\d*(e[\-\+]?\d+)?))(?=[^[:alpha:]_])",
        },
        {
            "name": "constant.numeric.integer",
            "match": r"\b([1-9]+[0-9]*|0)",
        },
        {
            "name": "constant",
            "match": r"\b(true|false|null)\b"
        }
    ]
}))

print xml
