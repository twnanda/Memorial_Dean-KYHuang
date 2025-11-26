function addUdnBookmark( f_title, f_url, f_digest, f_via) {
void(open('http://bookmark.udn.com/add?f_TITLE='+encodeURIComponent(f_title)+'&f_URL='+encodeURIComponent(f_url)+'&f_DIGEST='+encodeURIComponent(f_digest)+'&via='+encodeURIComponent(f_via)));
}