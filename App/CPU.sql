BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "CPU" (
	"cpu_family"	varchar(60),
	"processor_brand"	varchar(60),
	"processor_model"	varchar(60),
	"cores_threads"	varchar(60),
	"cpu_clock_normal"	varchar(60),
	"cpu_turbo_clock"	varchar(60),
	"igpu_clock"	varchar(60),
	"igpu_turbo_clock"	varchar(60),
	"l3_cache"	varchar(60),
	"l4_cache"	varchar(60),
	"tdp"	varchar(60),
	"release_date"	varchar(60),
	"socket"	varchar(60),
	"pcie_version"	varchar(60),
	"memory"	varchar(60),
	PRIMARY KEY("processor_model")
);
