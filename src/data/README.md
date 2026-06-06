# Aviation reference data

The generated JSON files in this directory provide local autocomplete suggestions
for the transport form.

- `airlines.json` is generated from the
  [OpenFlights airline database](https://openflights.org/data.php), filtered to
  active airlines with an IATA code.
- `airports.json` is generated from the
  [OurAirports database](https://ourairports.com/data/), filtered to airports
  with scheduled service and an IATA code.

OpenFlights provides its airline database under the Open Database License.
OurAirports publishes its source data as public domain. The suggestions are
reference data only and users can always enter free text.

To download the current sources and refresh the generated files, run:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/generate-aviation-data.ps1
```
