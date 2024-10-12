use regex::Regex;
use sanitize_html::rules::pattern::Pattern;
use sanitize_html::rules::{Element, Rules};

fn re(regex: &str) -> Pattern {
  Pattern::regex(Regex::new(regex).unwrap())
}

fn href() -> Pattern {
  re("^(ftp:|http:|https:|mailto:)") | !re("^[^/]+[[:space:]]*:")
}

pub static RULES: fn() -> Rules = untrusted;

fn untrusted() -> Rules {
  Rules::new()
    .element(
      Element::new("a")
        .attribute("href", href())
        .mandatory_attribute("target", "_blank")
        .mandatory_attribute("rel", "noreferrer noopener"),
    )
    .element(Element::new("b"))
    .element(Element::new("em"))
    .element(Element::new("i"))
    .element(Element::new("strong"))
    .element(Element::new("u"))
    .element(Element::new("span").attribute("class", re(r"text-slate")))
    .space("address")
    .space("article")
    .space("aside")
    .space("blockquote")
    .space("br")
    .space("dd")
    .space("div")
    .space("dl")
    .space("dt")
    .space("footer")
    .space("h1")
    .space("h2")
    .space("h3")
    .space("h4")
    .space("h5")
    .space("h6")
    .space("header")
    .space("hgroup")
    .space("hr")
    .space("li")
    .space("nav")
    .space("ol")
    .space("p")
    .space("pre")
    .space("section")
    .space("ul")
}
