#!/usr/bin/env perl
# PUID client (Perl). Auth via PUID_API_KEY.
use strict; use warnings;
use HTTP::Tiny; use JSON::PP;
my $BASE = "https://puid.dev/api";
my $http = HTTP::Tiny->new(default_headers => { "X-API-Key" => $ENV{PUID_API_KEY} // "" });
sub generate {
    my ($n) = @_; $n //= 1;
    die "n must be 1..10" unless $n >= 1 && $n <= 10;
    my $r = $http->get("$BASE/v1/ids?n=$n");
    die "Rate limited. One per second.\n" if $r->{status} == 429;
    return @{ decode_json($r->{content})->{ids} };
}
sub ordinal { my ($p) = @_; decode_json($http->get("$BASE/v1/ordinal/$p")->{content})->{ordinal} }
unless (caller) { print "$_\n" for generate(3); }
1;
