import assert from "node:assert/strict";
import test from "node:test";
import {
  cleanText,
  isEmail,
  isPhone,
  isSafeHttpUrl,
  isSafeImageDataUrl,
  parseContact,
} from "./cms-validate.ts";

test("cleanText strips markup and control characters", () => {
  assert.equal(cleanText("  <b>Hi</b>\u0000  ", 20), "bHi/b");
  assert.equal(cleanText("abcdef", 3), "abc");
});

test("urls accept only http and https", () => {
  assert.equal(isSafeHttpUrl("https://codexviber.example/work"), true);
  assert.equal(isSafeHttpUrl("javascript:alert(1)"), false);
  assert.equal(isSafeHttpUrl("not a url"), false);
  assert.equal(isSafeHttpUrl(""), false);
});

test("contact validation rejects incomplete messages", () => {
  assert.throws(() =>
    parseContact({ name: "A", email: "bad", subject: "Hi", message: "short" }),
  );
  const ok = parseContact({
    name: "Aaditya",
    email: "Aaditya37codex@gmail.com",
    subject: "Website",
    message: "I would like a small website for a school project.",
  });
  assert.equal(ok.email, "aaditya37codex@gmail.com");
});

test("phone and image checks", () => {
  assert.equal(isPhone("+91 9201109621"), true);
  assert.equal(isPhone("call me"), false);
  assert.equal(isEmail("admin1234@.com"), false);
  assert.equal(isEmail("admin1234@codexviber.com"), true);
  assert.equal(isSafeImageDataUrl(""), true);
  assert.equal(isSafeImageDataUrl("data:image/svg+xml;base64,PHN2Zy8+"), false);
  assert.equal(isSafeImageDataUrl("data:text/html;base64,PGh0bWw+"), false);
});
