require 'fileutils'
require 'json'


### Configuration variables
docs_dir            = "docs"
posts_dir           = "_posts"
site_branch         = "gh-pages"
dharmafly_docs_repo = "git@github.com:dharmafly/dharmafly-docs.git"
$default_category   = "about"


### Tasks


desc "Copies the contents of docs into a gh-pages branch, converting them into jekell"
task :generate do
  raise "Your project does not have a '#{docs_dir}' directory!" unless File.directory?(docs_dir)
  raise "You're already in the #{site_branch} branch!" if active_branch === site_branch

  if branch_exists? site_branch
    raise "Your repo already has a #{site_branch} branch! To copy across any updated docs run rake update"
  end
  
  # Checkout to new branch
  `git checkout --orphan #{site_branch}`

  # Cache all of the docs files
  cached_docs = cache_docs(docs_dir)

  # Remove existing files
  `git rm -rf .`

  # Add the dharmafly-docs repo
  `git remote add dharmafly-docs #{dharmafly_docs_repo}`

  # Pull the docs repo
  `git pull dharmafly-docs master`

  # Remove the dharmafly-docs repo
  `git remote rm dharmafly-docs`

  # Make the _posts directory if it doesn't exist
  Dir.mkdir(posts_dir) unless File.directory?(posts_dir)

  # Create a post for each doc
  create_posts(cached_docs, posts_dir)

  # Add & Commit the posts to the repo
  `git add .`
  `git commit . -m "Create project documentation with dharmafly docs"`

  puts "\nDocs generated successfully! To push the changes, type:"
  puts "git push origin #{site_branch}"
end

desc "Replaces the contents of _posts in the #{site_branch} branch with that of #{docs_dir}"
task :update do
  raise "No #{site_branch} branch found. Run 'rake generate' first" unless branch_exists?(site_branch)
  raise "You're already in the #{site_branch} branch!" if active_branch === site_branch
  raise "Your project does not have a '#{docs_dir}' directory!" unless File.directory?(docs_dir)

  # Cache all of the docs files
  cached_docs = cache_docs(docs_dir)

  # Switch to site branch
  `git checkout #{site_branch}`

  # Delete the posts directory if it exists
  if File.directory?(posts_dir)
    `git rm -rf #{posts_dir}`
  end

  # Recreate the posts directory
  Dir.mkdir(posts_dir)

  # Repopulate _posts directory with updated posts
  create_posts(cached_docs, posts_dir)

  # Add & Commit the posts to the repo
  `git add .`
  `git commit . -m "Update project documentation with dharmafly docs rakefile"`

  puts "\nDocs updated successfully! To push the changes, type:"
  puts "git push origin #{site_branch}"
end

desc "Start a local development server to test the site. (Requires Jekell)"
task :server do 
  raise "Jekyll is not installed. To install Jekyll, run:\nsudo gem install jekyll" unless jekyll_is_installed?
  
  # Switch to the site branch if not there already
  if active_branch != site_branch
    `git checkout #{site_branch}`
  end

  # Start the Jekyll server
  sh "jekyll --server"
end

#namespace :post do

#  desc "Create a new post"
#  task :new, :title do |t, args|
#    raise "You're not in the #{site_branch} branch!" if active_branch != site_branch
#    puts args.title
#  end

#end




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

  # add preceding zeros if number is less then 4 digits
  number = "1" + number until number.length >= 4

  # add rest of fake date
  post_name = number + "-01-01-" 

  # built post title
  post_title = filename[post_title_start..-1]
  post_title = post_title.downcase()
  post_title = post_title.sub(" ", "-")

  # add it all together and return it
  post_name += post_title
end

# Add front matter if it doesn't already exist
def add_front_matter(file_contents)
  if has_front_matter?(file_contents)
    return file_contents
  else
    return "---\ncategory: #{$default_category}\n---\n" + file_contents
  end
end

# Returns true if the file contains front matter
def has_front_matter?(file_contents)
  return file_contents[0..3] === "---\n"
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

# Returns the branches of the repo
def branches
  rtn = `git branch`
  return rtn.split(/\r?\n/)
end

def branch_exists?(branch_name)
  return branches.include?("  #{branch_name}")
end

# Returns the currently active branch
def active_branch
  branches.each do |branch|
    return branch[2..-1] if branch[0] === "*"
  end
end

# Empties the posts directory
def empty_dir(directory)
  Dir.foreach(directory) do |item|
    next if item[0] === "." or File.directory?(item)
    File.delete("#{directory}/#{item}")
  end
end

# Reads the contents of each doc and returns them as a hash
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

    new_name = old_name[3..-1].downcase()
    new_name = new_name.sub(" ", "-")
    new_name = "0001-01-1" + old_name[0] + "-" + new_name

    file = File.new("#{posts_dir}/#{new_name}", "w")
    file << add_front_matter(contents)
    file.close()
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

    file = File.new("#{posts_dir}/#{new_name}", "w")
    file << add_front_matter(contents)
    file.close()
  end
end


### helper functions


class String
  def is_numeric?
    true if Float(self) rescue false
  end
end