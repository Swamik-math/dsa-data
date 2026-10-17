import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  featured: boolean;
  urgent: boolean;
}

const CareersPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [hoveredJob, setHoveredJob] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const jobCategories = [
    "All", "Engineering", "Research", "Design", "Product", "Marketing", "Business", "People"
  ];

  const jobs: Job[] = [
    {
      id: "software-engineer-backend",
      title: "Software Engineer - Backend",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      salary: "$120,000 - $180,000",
      description: "Build scalable backend systems and APIs for our real estate platform.",
      requirements: ["Node.js/Python", "AWS/GCP", "PostgreSQL", "Redis", "Docker"],
      featured: true,
      urgent: false
    },
    {
      id: "software-engineer-frontend-ui",
      title: "Software Engineer - Frontend UI",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      salary: "$110,000 - $170,000",
      description: "Create beautiful, responsive user interfaces with modern React.",
      requirements: ["React", "TypeScript", "CSS/SCSS", "Figma", "REST APIs"],
      featured: true,
      urgent: true
    },
    {
      id: "product-manager",
      title: "Product Manager",
      department: "Product",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$140,000 - $200,000",
      description: "Lead product strategy and development for our core platform.",
      requirements: ["5+ years PM experience", "Agile/Scrum", "Data analysis", "User research"],
      featured: true,
      urgent: false
    },
    {
      id: "research-scientist",
      title: "Research Scientist",
      department: "Research",
      location: "Remote",
      type: "Full-time",
      salary: "$160,000 - $240,000",
      description: "Conduct cutting-edge AI/ML research for property recommendation systems.",
      requirements: ["PhD in CS/AI", "Publications", "TensorFlow/PyTorch", "NLP/CV"],
      featured: true,
      urgent: false
    },
    {
      id: "ai-tooling-engineer",
      title: "AI Tooling Engineer",
      department: "Engineering",
      location: "New York, NY",
      type: "Full-time",
      salary: "$130,000 - $190,000",
      description: "Build tools and infrastructure for AI model training and deployment.",
      requirements: ["Python", "MLOps", "Kubernetes", "CI/CD", "Monitoring"],
      featured: false,
      urgent: true
    },
    {
      id: "growth-marketer",
      title: "Growth Marketer",
      department: "Marketing",
      location: "Remote",
      type: "Full-time",
      salary: "$90,000 - $140,000",
      description: "Drive user acquisition and retention through data-driven marketing.",
      requirements: ["Digital marketing", "Analytics", "A/B testing", "SEO/SEM"],
      featured: false,
      urgent: false
    },
    {
      id: "product-designer",
      title: "Product Designer",
      department: "Design",
      location: "Austin, TX",
      type: "Full-time",
      salary: "$100,000 - $150,000",
      description: "Design intuitive user experiences for property discovery and virtual tours.",
      requirements: ["Figma/Sketch", "User research", "Prototyping", "Design systems"],
      featured: false,
      urgent: false
    },
    {
      id: "data-scientist",
      title: "Data Scientist",
      department: "Research",
      location: "Remote",
      type: "Full-time",
      salary: "$130,000 - $190,000",
      description: "Analyze property data and build predictive models for market insights.",
      requirements: ["Python/R", "SQL", "Statistics", "Machine Learning", "Data visualization"],
      featured: false,
      urgent: true
    },
    {
      id: "business-development-executive",
      title: "Business Development Executive",
      department: "Business",
      location: "Multiple Locations",
      type: "Full-time",
      salary: "$100,000 - $160,000 + Commission",
      description: "Build partnerships with real estate agencies and property developers.",
      requirements: ["Sales experience", "Negotiation", "Market analysis", "Relationship building"],
      featured: false,
      urgent: false
    },
    {
      id: "recruiter-product-engineering",
      title: "Recruiter - Product & Engineering",
      department: "People",
      location: "Remote",
      type: "Full-time",
      salary: "$85,000 - $130,000",
      description: "Help us build an exceptional team by recruiting top tech talent.",
      requirements: ["Tech recruiting", "Sourcing", "Interviewing", "Employer branding"],
      featured: false,
      urgent: false
    },
    {
      id: "software-engineer-ios",
      title: "Software Engineer - iOS",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      salary: "$115,000 - $175,000",
      description: "Develop our mobile app for property discovery on iOS devices.",
      requirements: ["Swift", "UIKit", "XCTest", "CI/CD", "App Store"],
      featured: false,
      urgent: true
    },
    {
      id: "distributed-systems-engineer",
      title: "Distributed Systems Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      salary: "$150,000 - $220,000",
      description: "Design and build scalable distributed systems for global property data.",
      requirements: ["Go/Rust", "Distributed systems", "Database design", "Performance optimization"],
      featured: true,
      urgent: false
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchesCategory = selectedCategory === "All" || job.department === selectedCategory;
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.requirements.some((req) => req.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const departments = [...new Set(jobs.map((job) => job.department))];
  const featuredJobs = jobs.filter((job) => job.featured);
  const urgentJobs = jobs.filter((job) => job.urgent);

  return (
    <div
      ref={sectionRef}
      className={`min-h-[calc(100vh-200px)] py-20 px-5 bg-gradient-to-br from-slate-50 to-slate-200 transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className={`mb-16 transition-all duration-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{transitionDelay: "0.2s"}}>
          <h1 className="text-5xl font-bold mb-6 text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Build the Future with Us
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl leading-relaxed">
            We're transforming how people discover and experience properties through
            innovative technology. Join our team of passionate engineers, designers,
            and visionaries.
          </p>

          {/* Stats Bar */}
          <div className="flex gap-6 flex-wrap mb-8">
            <div className={`bg-white p-6 rounded-xl shadow-lg flex-1 min-w-52 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`} style={{transitionDelay: "0.3s"}}>
              <div className="text-3xl font-bold text-blue-600 mb-2">{jobs.length}+</div>
              <div className="text-gray-600">Open Positions</div>
            </div>
            <div className={`bg-white p-6 rounded-xl shadow-lg flex-1 min-w-52 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`} style={{transitionDelay: "0.4s"}}>
              <div className="text-3xl font-bold text-green-600 mb-2">{departments.length}</div>
              <div className="text-gray-600">Departments</div>
            </div>
            <div className={`bg-white p-6 rounded-xl shadow-lg flex-1 min-w-52 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`} style={{transitionDelay: "0.5s"}}>
              <div className="text-3xl font-bold text-amber-500 mb-2">{urgentJobs.length}</div>
              <div className="text-gray-600">Urgent Roles</div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className={`mb-12 transition-all duration-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{transitionDelay: "0.6s"}}>
          <div className="mb-6 max-w-2xl relative">
            <input
              type="text"
              placeholder="Search jobs by title, skills, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-4 pl-14 pr-6 rounded-xl border-2 border-gray-300 text-lg bg-white focus:border-blue-600 focus:outline-none shadow-sm transition-all"
            />
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl text-gray-400">🔍</span>
          </div>

          {/* Category Filter */}
          <div className="flex gap-3 flex-wrap">
            {jobCategories.map((category, index) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105"
                    : "bg-white text-gray-700 shadow hover:shadow-md hover:scale-105"
                }`}
                style={{
                  opacity: isVisible ? 1 : 0,
                  transitionDelay: `${0.7 + index * 0.05}s`
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Job Results Counter */}
        <div className={`mb-8 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`} style={{transitionDelay: "0.8s"}}>
          <div className="flex justify-between items-center flex-wrap gap-5">
            <h2 className="text-2xl font-semibold text-gray-900">
              {filteredJobs.length} {filteredJobs.length === 1 ? "Job" : "Jobs"} Found
              {selectedCategory !== "All" && ` in ${selectedCategory}`}
            </h2>
            {searchTerm && (
              <div className="bg-gray-100 px-4 py-2 rounded-full text-sm text-gray-600">
                Search: "{searchTerm}"
              </div>
            )}
          </div>
        </div>

        {/* Featured Jobs Banner */}
        {featuredJobs.length > 0 && selectedCategory === "All" && !searchTerm && (
          <div className={`bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl mb-10 border-l-4 border-blue-600 animate-pulse transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{transitionDelay: "0.9s"}}>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold">🔥 FEATURED</span>
              <h3 className="text-xl font-semibold text-gray-900">Top Priority Roles - Apply Now!</h3>
            </div>
            <p className="text-gray-600">These roles are critical to our mission and come with accelerated hiring processes.</p>
          </div>
        )}

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {filteredJobs.map((job, index) => (
            <Link
              key={job.id}
              to={`/careers/${job.id}`}
              className={`bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl border-2 border-transparent hover:border-blue-600 transition-all duration-300 relative overflow-hidden transform hover:-translate-y-2 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{transitionDelay: `${1 + index * 0.1}s`}}
              onMouseEnter={() => setHoveredJob(job.id)}
              onMouseLeave={() => setHoveredJob(null)}
            >
              {/* Urgent Badge */}
              {job.urgent && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse z-10">
                  ⚡ URGENT
                </div>
              )}

              {/* Featured Badge */}
              {job.featured && (
                <div className={`absolute ${job.urgent ? "top-12" : "top-4"} right-4 bg-gradient-to-r from-amber-400 to-amber-600 text-white px-3 py-1 rounded-full text-xs font-bold z-10`}>
                  ⭐ FEATURED
                </div>
              )}

              {/* Hover Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 transition-opacity duration-300 ${hoveredJob === job.id ? "opacity-100" : "opacity-0"} pointer-events-none`} />

              <div className="relative z-10">
                <h3 className={`text-2xl font-bold mb-4 text-gray-900 ${job.featured || job.urgent ? "pr-24" : ""} transition-colors ${hoveredJob === job.id ? "text-blue-600" : ""}`}>
                  {job.title}
                </h3>

                <p className="text-gray-600 mb-6 leading-relaxed min-h-12">
                  {job.description}
                </p>

                {/* Tags */}
                <div className="flex gap-2 mb-6 flex-wrap">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {job.department}
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {job.location}
                  </span>
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                    {job.type}
                  </span>
                </div>

                {/* Salary and CTA */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="text-green-600 font-bold text-lg">{job.salary}</div>
                  <div className={`text-blue-600 font-semibold flex items-center gap-2 transition-all ${hoveredJob === job.id ? "translate-x-1" : ""}`}>
                    View Details
                    <span className="text-xl">→</span>
                  </div>
                </div>

                {/* Skills Preview */}
                <div className="flex gap-2 flex-wrap mt-4">
                  {job.requirements.slice(0, 3).map((skill, i) => (
                    <span key={i} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                  {job.requirements.length > 3 && (
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                      +{job.requirements.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredJobs.length === 0 && (
          <div className={`text-center py-20 transition-all duration-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{transitionDelay: "1s"}}>
            <div className="text-6xl mb-5 text-gray-300">🔍</div>
            <h3 className="text-3xl font-bold mb-3 text-gray-900">No jobs found</h3>
            <p className="text-lg text-gray-600 mb-8">
              {searchTerm
                ? `No jobs match "${searchTerm}"${selectedCategory !== "All" ? ` in ${selectedCategory}` : ""}`
                : `No jobs available${selectedCategory !== "All" ? ` in ${selectedCategory}` : ""}`}
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all hover:scale-105"
            >
              View All Jobs
            </button>
          </div>
        )}

        {/* Call to Action */}
        <div className={`text-center py-16 px-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl mt-16 transition-all duration-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{transitionDelay: "1.2s"}}>
          <h2 className="text-4xl font-bold mb-5 text-gray-900">
            Don't See the Perfect Role?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            We're always looking for talented people. Send us your resume and
            we'll contact you when a suitable position opens up.
          </p>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all animate-pulse">
            Submit General Application
          </button>
        </div>
      </div>
    </div>
  );
};

export default CareersPage;
