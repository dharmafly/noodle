require 'fileutils'
require 'json'
require 'yaml'


### Configuration variables
$docs_dir           = "docs"
$posts_dir          = "_posts"
site_branch         = "gh-pages"
dharmafly_docs_repo = "git@github.com:dharmafly/dharmafly-docs.git"
$default_category   = "overview"


### Tasks


desc "Initializes dharmafly-docs if #{site_branch} does not exist, otherwise copies posts to #{site_branch}"
task :build do
  raise "You're already in the #{site_branch} branch!" if Git.active_branch?(site_branch)
  raise "Your project does not have a '#{$docs_dir}' directory!" unless File.directory?($docs_dir)

  # Cache all of the docs files
  cached_docs = cache_docs($docs_dir)
  
  # Checkout to site branch
  if Git.branch_exists?(site_branch)
    clean_install = false
    sh("git checkout #{site_branch}")
  else
    clean_install = true
    sh("git checkout --orphan #{site_branch}")

    # Remove existing files
    sh("git rm -rf .")

    # Add the dharmafly-docs repo
    sh("git remote add dharmafly-docs #{dharmafly_docs_repo}") unless Git.remote_exists?("dharmafly-docs")

    # Pull the docs repo
    sh("git pull dharmafly-docs master")

    # Remove the dharmafly-docs repo
    sh("git remote rm dharmafly-docs") if Git.remote_exists?("dharmafly-docs")
  end

  # Delete the posts directory if it exists
  sh("git rm -rf #{$posts_dir}") if File.directory?($posts_dir)

  # Recreate the posts directory
  Dir.mkdir($posts_dir)

  # Create a post for each doc
  create_posts(cached_docs, $posts_dir)

  # Add & Commit the posts to the repo
  sh("git add .")

  if clean_install
    sh('git commit . -m "Create project documentation with dharmafly docs"')
  else
    sh('git commit . -m "Update project documentation with dharmafly docs"') rescue puts "commit aborted"
  end

  puts "\nDocs generated successfully! " + "Don't forget to update your _config.yml".bright()
  puts "\nTo push the changes, type:"
  puts "git push origin #{site_branch}"

  # Notify user of active branch
  puts "\nActive Branch: ".bold_green() + Git.active_branch
end

desc "Start a local development server to test the site. (Requires Jekyll)"
task :server do 
  unless jekyll_is_installed?
    raise "Jekyll is not installed. To install Jekyll, run:\nsudo gem install jekyll"
  end
  
  # Switch to the site branch if not there already
  sh("git checkout #{site_branch}") unless Git.active_branch?(site_branch)

  # Start the Jekyll server
  sh("jekyll --server")

  # Notify user of active branch
  puts "\nActive Branch: ".bold_green() + Git.active_branch
end

desc "Pulls to latest version of dharmafly-docs to your #{site_branch} branch."
task :upgrade do
  raise "Your project does not have a #{site_branch} branch!" unless Git.branch_exists?(site_branch)

  # Switch to the site branch if not there already
  sh("git checkout #{site_branch}") unless Git.active_branch?(site_branch)

  # Add the dharmafly-docs repo
  sh("git remote add dharmafly-docs #{dharmafly_docs_repo}") unless Git.remote_exists?("dharmafly-docs")

  # Pull the docs repo
  sh("git pull dharmafly-docs master")

  # Remove the dharmafly-docs repo
  sh("git remote rm dharmafly-docs") if Git.remote_exists?("dharmafly-docs")

  # Notify user of active branch
  puts "\nActive Branch: ".bold_green() + Git.active_branch
end




### methods




# Converts the filename of a doc to the Jekyll post format
def postify(filename)
  number = ""
  post_title_start = 0

  # get the number out of the filename string
  filename.split("").each_with_index do |c, i|
    post_title_start = i + 1
    break if c == " " or c == "-"
    next if not c.is_numeric?
    number += c
  end

  # used to determine if a 1 has been prepended yet
  prepend_number = ""

  # add preceding 1 & zeros if number is less then 4 digits
  until  prepend_number.length + number.length >= 4 do
    if prepend_number === ""
      prepend_number = "2" + prepend_number
    else
      prepend_number = "0" + prepend_number
    end
  end

  # add rest of fake date
  post_name = prepend_number.reverse() + number + "-01-01-" 

  # built post title
  post_title = filename[post_title_start..-1]
  post_title = post_title.gsub(/^\d|[^\w \-\.]|\.|(md)$/, "")
  post_title.strip!
  post_title = post_title.downcase()
  post_title = post_title.gsub(" ", "-")
  post_title += ".md"

  # add it all together and return it
  post_name += post_title
end

# Add front matter if it doesn't already exist
def add_front_matter(filename, file_contents)
  heading = filename[filename.index(/(\ |\-)/)+1..filename.index(/(\.md)$/)-1]

  if has_front_matter?(file_contents)
    front_matter = read_front_matter(file_contents)
    front_matter["category"] = $default_category unless front_matter["category"]
    front_matter["heading"] = heading unless front_matter["heading"]
  else
    front_matter = {
      "category" => $default_category,
      "heading" => heading
    }
  end

  return YAML.dump(front_matter) + "---\n" + file_contents.gsub(/\-\-\-([^\-\-\-]*)\-\-\-/, '')
end

# Returns true if the file contains front matter
def has_front_matter?(file_contents)
  return file_contents[0..3] === "---\n"
end

def read_front_matter(file_contents)
  YAML.load(file_contents.scan(/\-\-\-([^\-\-\-]*)\-\-\-/).first.first)
end

# Returns true if Jekyll is installed on this system
def jekyll_is_installed?
  begin
    `jekyll`
  rescue
    return false
  else
    return true
  end
end

module Git

  # Returns the remotes in the repo
  def Git.remote
    `git remote`.split(/\r?\n/)
  end

  # Returns true if parameterized remote exists
  def Git.remote_exists?(remote)
    Git.remote.include?(remote)
  end

  # Returns the branches of the repo
  def Git.branch
    `git branch`.split(/\r?\n/)
  end

  # Returns true if the parameterized branch exists
  def Git.branch_exists?(branch_name)
    Git.branch.include?("  #{branch_name}")
  end

  # Returns the currently active branch
  def Git.active_branch
    Git.branch.each do |branch|
      return branch[2..-1] if branch[0] === "*"
    end
  end

  # Returns true if the parameterized branch is the one 
  # that is active at the moment
  def Git.active_branch?(branch)
    Git.active_branch === branch
  end

end

# Create a hash out of each doc in the docs_dir
def cache_docs (docs_dir)
  rtn = Hash.new()

  Dir.foreach(docs_dir) do |item|
    next if item[0] === "." or File.directory?(item)
    rtn[item] = File.read("#{docs_dir}/#{item}")
  end

  return rtn
end

# Create posts for each cached doc
def create_posts (cached_docs, posts_dir)
  cached_docs.each do |old_name, contents|
    new_name = postify(old_name)
    puts "write '#{posts_dir}/#{new_name}'"
    file = File.new("#{posts_dir}/#{new_name}", "w")
    file << add_front_matter(old_name, contents)
    file.close()
  end
end


### helper functions


class String
  def is_numeric?
    true if Float(self) rescue false
  end

  def ansi_escape(codes)
    codes = codes.join(";") if codes.kind_of?(Array)
    return "\e[#{codes}m#{self}\e[0m"
  end

  def bold_green
    self.ansi_escape([1,32])
  end

  def underline
    self.ansi_escape(4)
  end

  def bright
    self.ansi_escape(1)
  end
end
