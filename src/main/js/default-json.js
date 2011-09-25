var data_json = {"services": [
        {"name": "Zookeeper", "version": "1.3.3", "description": "ZooKeeper is a centralized service for maintaining configuration information, naming, providing distributed synchronization, and providing group services. All of these kinds of services are used in some form or another by distributed applications. Each time they are implemented there is a lot of work that goes into fixing the bugs and race conditions that are inevitable.", "color": "yellow", "dependencies": []},
        {"name": "MySQL", "version": "5.1.46.8", "description": "MySQL is a relational database management system (RDBMS) that runs as a server providing multi-user access to a number of databases.", "color": "green", "dependencies":["mysql_status"]},
        {"name": "mysql_status", "version": "1.2.3", "description": "This system provides an extensible way to both collect MySQL statistics/status and related information, as well as to serve it as a webservice for use with Vips or Yfor rotation.  (GSLB rotations not generally recommended).", "color": "blue", "dependencies":[]},
        {"name": "Vespa", "version": "4.2", "description": "The Yahoo! vertical search platform — providing your property with scalability, data storage, and state-of-the-art search technology.", "color": "pink", "dependencies":["Zookeeper"]}
    ],

	"hosts": [
		{"hostname": "admin-01.sm.gq1.yahoo.com",
		 "services": [{"name": "Zookeeper", "position_x": 0, "position_y": 2}, {"name": "Vespa", "position_x": 2, "position_y": 3}]
		},
		{"hostname": "jack-01.ops.sp2.yahoo.com",
		 "services": [{"name": "mysql_status", "position_x": 3, "position_y": 3}, {"name": "MySQL", "position_x": 3, "position_y": 4}]
		}
	]
};