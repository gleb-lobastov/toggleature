/**
 * @jest-environment jsdom
 */
import toggleatureBus from "./toggleatureBus";
import { FeatureToggleState } from "./toggleatureBus.interface";

describe("coreBus", function () {
    const testFeatureA: FeatureToggleState = {
        description: "testFeatureA description",
        caption: "testFeatureA caption",
        responsible: "testFeatureA responsible",
        testReady: false,
        inRelease: false,
        enabled: false,
    };
    const testFeatureB: FeatureToggleState = {
        description: "testFeatureB description",
        caption: "testFeatureB caption",
        responsible: "testFeatureB responsible",
        testReady: false,
        inRelease: false,
        enabled: false,
    };

    it("should merge updates to state with mergeStrategy", function () {
        const busConnection = toggleatureBus<"testFeatureA" | "testFeatureB">({
            initialState: { testFeatureA, testFeatureB },
        });
        busConnection.update({ testFeatureA: true });
        expect(busConnection.state?.testFeatureA).toEqual({
            ...testFeatureA,
            enabled: true,
        });
    });
});
