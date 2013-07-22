#!/usr/bin/perl
use FindBin;
use File::Spec;

# Read File and Parse the HTML Text into RequireJS File
sub parseHtmlText
{
	my $path = shift;

	if (-d $path) {
		opendir(DIR, $path) or die "Can't open $path: $!";
		my @files = readdir(DIR);
		foreach (@files) {
			if ($_ !~ m/^\./i && $_ !~ m/\.js$/i) {
				parseHtmlText($path . "/" . $_);
			}
		}
		closedir DIR;
	} elsif (-f $path) {
		# Read File and save as *.html.js
		my $html;

		open FILE, $path or die $!;

		$html = "define(function() { var str ='";
		while (<FILE>) {
			$_ =~ s/^\s*(.*?)\s*$/$1/;
			$_ =~ s/\'/\\'/g;
			$html .= $_;
		}

		$html .= "';return str;});";

		close(FILE);

		# Then Save as .html.js
		my @parts = split /\./, $path;
		$ext = pop @parts;
		my $file_no_ext = join '.', @parts;

		open FILE, ">".$file_no_ext.".".$ext.".js" or die $!;
		print FILE $html;
		close FILE;
	}
}

#=== Start ===#
print "Parse html template into requirejs.\n";

my $currentPath = $FindBin::Bin."/../templates";

parseHtmlText($currentPath);

$currentPath = $FindBin::Bin."/../data";

parseHtmlText($currentPath);

print "Finished.\n";

exit;
