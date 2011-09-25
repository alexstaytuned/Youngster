var data_json = {"services": [
        {"name": "Zookeeper", "version": "1.3.3", "description": "ZooKeeper is a centralized service for maintaining configuration information, naming, providing distributed synchronization, and providing group services. All of these kinds of services are used in some form or another by distributed applications. Each time they are implemented there is a lot of work that goes into fixing the bugs and race conditions that are inevitable.", "color": "yellow", "dependencies": []},
        {"name": "MySQL", "version": "5.1.46.8", "description": "MySQL is a relational database management system (RDBMS) that runs as a server providing multi-user access to a number of databases.", "color": "green", "dependencies":["NFS"]},
        {"name": "NFS", "version": "n/a", "description": "MySQL is writing to an NFS filer", "color": "blue", "dependencies":[]},
        {"name": "Solr", "version": "3.4.0", "description": "Solr is the popular, blazing fast open source enterprise search platform from the Apache Lucene project. Its major features include powerful full-text search, hit highlighting, faceted search, dynamic clustering, database integration, rich document (e.g., Word, PDF) handling, and geospatial search.", "color": "pink", "dependencies":["Zookeeper"]}
    ],

	"hosts": [
		{"hostname": "blah.hostname.com",
		 "services": [{"name": "Zookeeper", "position_x": 0, "position_y": 2}, {"name": "Solr", "position_x": 2, "position_y": 3}]
		},
		{"hostname": "blahblah.hostname2.com",
		 "services": [{"name": "NFS", "position_x": 3, "position_y": 3}, {"name": "MySQL", "position_x": 3, "position_y": 4}]
		}
	]
};