import ComponentPropertyApplier from "../ComponentPropertyApplier.js";

const VALID_TYPES = new Set([
    "number",
    "string",
    "size",
    "fontSize",
    "color",
    "spacing",
    "select"
]);

export default function runComponentRegistryTests(registry) {
    const applier = new ComponentPropertyApplier(registry);

    let passed = 0;
    let failed = 0;

    console.log("\n========== REGISTRY INTEGRITY TESTS ==========\n");

    function test(name, callback) {
        try {
            callback();
            passed++;
            console.log(`PASS — ${name}`);
        } catch (error) {
            failed++;
            console.error(`FAIL — ${name}\n`, error.message);
        }
    }

    function assert(condition, message) {
        if (!condition) {
            throw new Error(message);
        }
    }

    test("Registry contains component types", () => {
        assert(
            registry.getTypes().length > 0,
            "No components are registered."
        );
    });

    for (const type of registry.getTypes()) {
        const descriptor = registry.get(type);

        test(`${type}: valid component descriptor`, () => {
            assert(descriptor !== null, "Descriptor is missing.");
            assert(descriptor.type === type, "Descriptor type mismatch.");
            assert(
                typeof descriptor.component === "function",
                "Component constructor is missing."
            );
            assert(
                descriptor.properties &&
                typeof descriptor.properties === "object" &&
                !Array.isArray(descriptor.properties),
                "Properties must be an object."
            );
            assert(
                descriptor.layoutOptions &&
                typeof descriptor.layoutOptions === "object" &&
                !Array.isArray(descriptor.layoutOptions),
                "Layout options must be an object."
            );
        });

        const groups = [
            ["property", descriptor.properties],
            ["layout option", descriptor.layoutOptions]
        ];

        for (const [groupName, definitions] of groups) {
            for (const [name, definition] of Object.entries(definitions)) {
                const label = `${type}.${name} (${groupName})`;

                test(`${label}: valid metadata`, () => {
                    assert(
                        definition &&
                        typeof definition === "object" &&
                        !Array.isArray(definition),
                        "Definition must be an object."
                    );

                    assert(
                        VALID_TYPES.has(definition.type),
                        `Unsupported type "${definition.type}".`
                    );

                    assert(
                        typeof definition.label === "string" &&
                        definition.label.length > 0,
                        "A non-empty label is required."
                    );

                    assert(
                        Object.hasOwn(definition, "default"),
                        "A default value must be defined."
                    );

                    if (definition.type === "select") {
                        assert(
                            Array.isArray(definition.options) &&
                            definition.options.length > 0,
                            "Select properties need non-empty options."
                        );
                    }

                    if (definition.min !== undefined) {
                        assert(
                            typeof definition.min === "number" &&
                            Number.isFinite(definition.min),
                            "min must be a finite number."
                        );
                    }

                    if (definition.max !== undefined) {
                        assert(
                            typeof definition.max === "number" &&
                            Number.isFinite(definition.max),
                            "max must be a finite number."
                        );
                    }

                    if (definition.step !== undefined) {
                        assert(
                            typeof definition.step === "number" &&
                            Number.isFinite(definition.step) &&
                            definition.step > 0,
                            "step must be a positive finite number."
                        );
                    }
                });

                test(`${label}: valid default value`, () => {
                    applier.validateValue(
                        type,
                        name,
                        definition,
                        definition.default
                    );
                });

                if (definition.apply) {
                    test(`${label}: valid application mapping`, () => {
                        const apply = definition.apply;

                        assert(
                            ["property", "method", "group"].includes(apply.type),
                            `Unknown strategy "${apply.type}".`
                        );

                        if (apply.type === "property") {
                            assert(
                                typeof apply.name === "string" &&
                                apply.name.length > 0,
                                "Property mapping needs a name."
                            );
                        }

                        if (
                            apply.type === "method" ||
                            apply.type === "group"
                        ) {
                            assert(
                                typeof apply.name === "string" &&
                                typeof descriptor.component.prototype[apply.name]
                                    === "function",
                                `Method "${apply.name}" does not exist on ` +
                                `${type}'s prototype.`
                            );
                        }

                        if (apply.type === "group") {
                            assert(
                                typeof apply.property === "string" &&
                                apply.property.length > 0,
                                "Group mapping needs a target property."
                            );
                        }
                    });
                }
            }
        }
    }

    console.log("\n========== RESULTS ==========");
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log("=============================\n");

    return { passed, failed };
}
